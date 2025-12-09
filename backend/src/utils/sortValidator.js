// utils/sortValidator.js
const ALLOWED_SORT_FIELDS = [
  'customer_name',
  'product_name', 
  'store_location',
  'date',
  'total_amount',
  'final_amount',
  'quantity',
  'price_per_unit',
  'payment_method',
  'order_status'
];

exports.validateSortField = (field) => {
  return ALLOWED_SORT_FIELDS.includes(field) ? field : 'date';
};