const express = require('express');
const router = express.Router();
const transactionsController = require('../controllers/transactionsController');

router.get('/', transactionsController.getTransactions);
router.get('/:id', transactionsController.getTransactionById);

module.exports = router;
