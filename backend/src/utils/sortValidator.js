const ALLOWED = {
  date: 's.date',
  quantity: 's.quantity',
  customer_name: 'c.name'
};

exports.validateSortField = (requested) => {
  const key = String(requested || 'date');
  return ALLOWED[key] || ALLOWED.date;
};
