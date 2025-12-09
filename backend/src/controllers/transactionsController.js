const transactionService = require('../services/transactionService');
const { idSchema } = require('../utils/validators');

exports.getTransactions = async (req, res, next) => {
  try {
    console.log('[DEBUG] GET /api/transactions query ->', req.query);
    const result = await transactionService.fetchTransactions(req.query);
    return res.status(200).json(result);
  } catch (err) {
    console.error('[ERROR] getTransactions:', err);
    return next(err);
  }
};

exports.getTransactionById = async (req, res, next) => {
  try {
    console.log('[DEBUG] GET /api/transactions/:id -> param:', req.params.id);
    const { error, value } = idSchema.validate({ id: req.params.id });
    if (error) {
      console.log('[DEBUG] idSchema validation failed ->', error.details[0].message);
      return res.status(400).json({ success: false, error: error.details[0].message });
    }

    const tx = await transactionService.fetchTransactionById(value.id);
    console.log('[DEBUG] service.fetchTransactionById returned ->', !!tx ? 'FOUND' : 'NOT FOUND');
    if (!tx) {
      return res.status(404).json({ success: false, error: 'Transaction not found' });
    }

    return res.json({ success: true, data: tx });
  } catch (err) {
    console.error('[ERROR] getTransactionById:', err);
    return next(err);
  }
};
