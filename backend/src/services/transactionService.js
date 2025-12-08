const Sale = require('../models/Sale');
const Customer = require('../models/Customer');
const Product = require('../models/Product');
const Store = require('../models/Store');
const { validateSortField } = require('../utils/sortValidator');

/**
 * Build a match object for sale-level filters
 */
function buildSaleMatch(query) {
  const match = {};

  if (query.payment_methods) match.payment_method = { $in: String(query.payment_methods).split(',').map(s => s.trim()) };
  if (query.date_from || query.date_to) {
    match.date = {};
    if (query.date_from) match.date.$gte = new Date(query.date_from);
    if (query.date_to) match.date.$lte = new Date(query.date_to);
  }
  if (query.order_status) match.order_status = { $in: String(query.order_status).split(',').map(s => s.trim()) };
  if (query.quantity_min || query.quantity_max) {
    match.quantity = {};
    if (query.quantity_min) match.quantity.$gte = Number(query.quantity_min);
    if (query.quantity_max) match.quantity.$lte = Number(query.quantity_max);
  }
  return match;
}

/**
 * Primary fetch function: returns paginated results with joined customer/product/store
 */
exports.fetchTransactions = async (query) => {
  const q = query.q ? String(query.q).trim() : null;
  const page = Math.max(1, parseInt(query.page || '1', 10));
  const limit = 10;
  const skip = (page - 1) * limit;

  const sortField = validateSortField(query.sort_by || 'date');
  const sortOrder = (query.sort_order === 'asc') ? 1 : -1;
  const sortStage = { [sortField]: sortOrder, _id: -1 };

  // sale-level filters
  const saleMatch = buildSaleMatch(query);

  const pipeline = [];

  if (Object.keys(saleMatch).length) pipeline.push({ $match: saleMatch });

  // lookups
  pipeline.push(
    { $lookup: { from: 'customers', localField: 'customer_id', foreignField: 'customer_id', as: 'customer' } },
    { $unwind: { path: '$customer', preserveNullAndEmptyArrays: true } },

    { $lookup: { from: 'products', localField: 'product_id', foreignField: 'product_id', as: 'product' } },
    { $unwind: { path: '$product', preserveNullAndEmptyArrays: true } },

    { $lookup: { from: 'stores', localField: 'store_id', foreignField: 'store_id', as: 'store' } },
    { $unwind: { path: '$store', preserveNullAndEmptyArrays: true } }
  );

  // Build post-lookup match (customer/product filters & search)
  const postMatch = {};

  // search: find matching customer ids via text index first
  if (q) {
    const matchingCustomers = await Customer.find({ $text: { $search: q } }, { customer_id: 1 }).lean();
    const ids = matchingCustomers.map(c => c.customer_id);
    if (ids.length === 0) {
      return { data: [], meta: { page, page_size: limit, total_items: 0, total_pages: 0 } };
    }
    postMatch.customer_id = { $in: ids };
  }

  if (query.regions) postMatch['customer.region'] = { $in: String(query.regions).split(',').map(s => s.trim()) };
  if (query.genders) postMatch['customer.gender'] = { $in: String(query.genders).split(',').map(s => s.trim()) };
  if (query.age_min || query.age_max) {
    postMatch['customer.age'] = {};
    if (query.age_min) postMatch['customer.age'].$gte = Number(query.age_min);
    if (query.age_max) postMatch['customer.age'].$lte = Number(query.age_max);
  }
  if (query.categories) postMatch['product.category'] = { $in: String(query.categories).split(',').map(s => s.trim()) };
  if (query.tags) postMatch['product.tags'] = { $in: String(query.tags).split(',').map(s => s.trim()) };

  if (Object.keys(postMatch).length) pipeline.push({ $match: postMatch });

  // Facet to get paged data + total count
  pipeline.push(
    { $sort: sortStage },
    {
      $facet: {
        data: [
          { $skip: skip },
          { $limit: limit }
        ],
        totalCount: [
          { $count: 'count' }
        ]
      }
    }
  );

  const agg = await Sale.aggregate(pipeline).allowDiskUse(true);
  const data = (agg[0] && agg[0].data) || [];
  const totalCount = (agg[0] && agg[0].totalCount && agg[0].totalCount[0]) ? agg[0].totalCount[0].count : 0;

  // Normalize output
  const formatted = data.map(item => ({
    sale_id: item.sale_id,
    date: item.date,
    quantity: item.quantity,
    price_per_unit: item.price_per_unit,
    total_amount: item.total_amount,
    final_amount: item.final_amount,
    payment_method: item.payment_method,
    order_status: item.order_status,
    delivery_type: item.delivery_type,
    store: item.store || null,
    product: item.product || null,
    customer: item.customer || null,
    salesperson_id: item.salesperson_id,
    employee_name: item.employee_name
  }));

  return {
    data: formatted,
    meta: { page, page_size: limit, total_items: totalCount, total_pages: Math.ceil(totalCount / limit) }
  };
};

exports.fetchTransactionById = async (saleId) => {
  const pipeline = [
    { $match: { sale_id: saleId } },
    { $lookup: { from: 'customers', localField: 'customer_id', foreignField: 'customer_id', as: 'customer' } },
    { $unwind: { path: '$customer', preserveNullAndEmptyArrays: true } },
    { $lookup: { from: 'products', localField: 'product_id', foreignField: 'product_id', as: 'product' } },
    { $unwind: { path: '$product', preserveNullAndEmptyArrays: true } },
    { $lookup: { from: 'stores', localField: 'store_id', foreignField: 'store_id', as: 'store' } },
    { $unwind: { path: '$store', preserveNullAndEmptyArrays: true } },
    { $limit: 1 }
  ];

  const res = await Sale.aggregate(pipeline);
  return res[0] || null;
};
