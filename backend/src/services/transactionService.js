const mongoose = require('mongoose');
const Sale = require('../models/Sale');
const { validateSortField } = require('../utils/sortValidator');

const toArray = (val) => {
  if (!val && val !== 0) return null;
  return String(val).split(',').map(s => s.trim()).filter(Boolean);
};
const toNumber = (v) => (v !== undefined && v !== null && v !== '') ? Number(v) : undefined;
const escapeRegExp = (s = '') => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const SORT_FIELD_MAP = {
  'customer_name': 'customer.name',
  'product_name': 'product.name',
  'store_location': 'store.location',
  'date': 'date',
  'total_amount': 'total_amount',
  'final_amount': 'final_amount',
  'quantity': 'quantity',
  'price_per_unit': 'price_per_unit',
  'payment_method': 'payment_method',
  'order_status': 'order_status'
};

function buildSaleMatch(qs) {
  const f = {};
  const paymentMethods = toArray(qs.payment_methods);
  if (paymentMethods) f.payment_method = { $in: paymentMethods };

  if (qs.date_from || qs.date_to) {
    f.date = {};
    if (qs.date_from) f.date.$gte = new Date(qs.date_from);
    if (qs.date_to) f.date.$lte = new Date(qs.date_to);
  }

  if (qs.order_status) {
    const s = toArray(qs.order_status);
    if (s) f.order_status = { $in: s };
  }

  const qMin = toNumber(qs.quantity_min);
  const qMax = toNumber(qs.quantity_max);
  if (qMin !== undefined || qMax !== undefined) {
    f.quantity = {};
    if (qMin !== undefined) f.quantity.$gte = qMin;
    if (qMax !== undefined) f.quantity.$lte = qMax;
  }

  return f;
}

async function findCustomerIdsInTruestate(q) {
  if (!q || !String(q).trim()) return null;
  const coll = mongoose.connection.db.collection('truestate');
  const docs = await coll.find({ $text: { $search: q }, type: 'customer' }, { projection: { customer_id: 1 } }).limit(500).toArray();
  if (!docs.length) return [];
  return docs.map(d => d.customer_id).filter(Boolean);
}

function buildPostLookupFilters(qs) {
  const f = {};
  const regions = toArray(qs.regions);
  if (regions) f['customer.region'] = { $in: regions.map(r => new RegExp(`^${escapeRegExp(r)}$`, 'i')) };

  const genders = toArray(qs.genders);
  if (genders) f['customer.gender'] = { $in: genders.map(g => new RegExp(`^${escapeRegExp(g)}$`, 'i')) };

  const ageMin = toNumber(qs.age_min);
  const ageMax = toNumber(qs.age_max);
  if (ageMin !== undefined || ageMax !== undefined) {
    f['customer.age'] = {};
    if (ageMin !== undefined) f['customer.age'].$gte = ageMin;
    if (ageMax !== undefined) f['customer.age'].$lte = ageMax;
  }

  const categories = toArray(qs.categories);
  if (categories) f['product.category'] = { $in: categories.map(c => new RegExp(`^${escapeRegExp(c)}$`, 'i')) };

  const tags = toArray(qs.tags);
  if (tags) f['product.tags'] = { $in: tags.map(t => new RegExp(`^${escapeRegExp(t)}$`, 'i')) };

  return f;
}

exports.fetchTransactions = async (qs) => {
  const rawQ = qs.q ? String(qs.q).trim() : '';
  const searchQ = rawQ || null;
  
  const page = Math.max(1, parseInt(qs.page || '1', 10));
  const PAGE_SIZE = 10;
  const skip = (page - 1) * PAGE_SIZE;

  const requestedSort = validateSortField(qs.sort_by || 'date');
  const sortField = SORT_FIELD_MAP[requestedSort] || requestedSort;
  const sortDir = (qs.sort_order === 'asc') ? 1 : -1;
  const sortStage = { [sortField]: sortDir, _id: -1 };

  const saleMatch = buildSaleMatch(qs);

  const customerIds = await findCustomerIdsInTruestate(searchQ);
  if (customerIds && customerIds.length === 0) {
    return { data: [], meta: { page, page_size: PAGE_SIZE, total_items: 0, total_pages: 0 } };
  }

  const pipeline = [];
  if (Object.keys(saleMatch).length) pipeline.push({ $match: saleMatch });

  pipeline.push(
    {
      $lookup: {
        from: 'truestate',
        let: { cid: '$customer_id' },
        pipeline: [
          { $match: { $expr: { $and: [{ $eq: ['$type', 'customer'] }, { $eq: ['$customer_id', '$$cid'] }] } } },
          { $project: { _id: 0, customer_id: 1, name: 1, phone: 1, gender: 1, age: 1, region: 1 } }
        ],
        as: 'customer'
      }
    },
    { $unwind: { path: '$customer', preserveNullAndEmptyArrays: true } },

    {
      $lookup: {
        from: 'truestate',
        let: { pid: '$product_id' },
        pipeline: [
          { $match: { $expr: { $and: [{ $eq: ['$type', 'product'] }, { $eq: ['$product_id', '$$pid'] }] } } },
          { $project: { _id: 0, product_id: 1, name: 1, brand: 1, category: 1, tags: 1 } }
        ],
        as: 'product'
      }
    },
    { $unwind: { path: '$product', preserveNullAndEmptyArrays: true } },

    {
      $lookup: {
        from: 'truestate',
        let: { sid: '$store_id' },
        pipeline: [
          { $match: { $expr: { $and: [{ $eq: ['$type', 'store'] }, { $eq: ['$store_id', '$$sid'] }] } } },
          { $project: { _id: 0, store_id: 1, location: 1 } }
        ],
        as: 'store'
      }
    },
    { $unwind: { path: '$store', preserveNullAndEmptyArrays: true } }
  );

  const postFilters = buildPostLookupFilters(qs);
  if (customerIds) postFilters.customer_id = { $in: customerIds };
  if (Object.keys(postFilters).length) pipeline.push({ $match: postFilters });

  pipeline.push(
    { $sort: sortStage },
    {
      $facet: {
        data: [{ $skip: skip }, { $limit: PAGE_SIZE }],
        totalCount: [{ $count: 'count' }]
      }
    }
  );

  const agg = await Sale.aggregate(pipeline).allowDiskUse(true);
  const rows = (agg[0] && agg[0].data) || [];
  const total = (agg[0] && agg[0].totalCount && agg[0].totalCount[0]) ? agg[0].totalCount[0].count : 0;

  const formatted = rows.map(item => ({
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
    meta: { page, page_size: PAGE_SIZE, total_items: total, total_pages: Math.ceil(total / PAGE_SIZE) }
  };
};

exports.fetchTransactionById = async (saleId) => {
  if (!saleId) return null;
  
  const txId = parseInt(saleId, 10);
  console.log('[DEBUG] Searching for Transaction ID:', txId);

  const pipeline = [
    { $match: { 'Transaction ID': txId } },  
    
    {
      $lookup: {
        from: 'truestate',
        let: { cid: '$Customer ID' },  
        pipeline: [
          { $match: { $expr: { $and: [{ $eq: ['$type', 'customer'] }, { $eq: ['$Customer ID', '$$cid'] }] } } },
          { $project: { _id: 0, 'Customer ID': 1, 'Customer Name': 1, 'Phone Number': 1, Gender: 1, Age: 1, 'Customer Region': 1 } }
        ],
        as: 'customer'
      }
    },
    { $unwind: { path: '$customer', preserveNullAndEmptyArrays: true } },

    {
      $lookup: {
        from: 'truestate',
        let: { pid: '$Product ID' },
        pipeline: [
          { $match: { $expr: { $and: [{ $eq: ['$type', 'product'] }, { $eq: ['$Product ID', '$$pid'] }] } } },
          { $project: { _id: 0, 'Product ID': 1, 'Product Name': 1, Brand: 1, 'Product Category': 1, Tags: 1 } }
        ],
        as: 'product'
      }
    },
    { $unwind: { path: '$product', preserveNullAndEmptyArrays: true } },

    {
      $lookup: {
        from: 'truestate',
        let: { sid: '$Store ID' },
        pipeline: [
          { $match: { $expr: { $and: [{ $eq: ['$type', 'store'] }, { $eq: ['$Store ID', '$$sid'] }] } } },
          { $project: { _id: 0, 'Store ID': 1, 'Store Location': 1 } }
        ],
        as: 'store'
      }
    },
    { $unwind: { path: '$store', preserveNullAndEmptyArrays: true } },

    { $limit: 1 }
  ];

  const res = await Sale.aggregate(pipeline);
  console.log('[DEBUG] Found documents:', res.length);
  
  return res[0] || null;
};