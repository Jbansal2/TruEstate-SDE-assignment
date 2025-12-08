const transactionService = require('../services/transactionService');

exports.getTransactions = async (req, res, next) => {
  try {
    const result = await transactionService.fetchTransactions(req.query);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

exports.getTransactionById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const tx = await transactionService.fetchTransactionById(id);
    if (!tx) return res.status(404).json({ error: 'Transaction not found' });
    res.json(tx);
  } catch (err) {
    next(err);
  }
};
