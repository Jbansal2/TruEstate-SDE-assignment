const express = require('express');
const router = express.Router();
const controller = require('../controllers/transactionsController');

router.get('/', controller.getTransactions);     
router.get('/:id', controller.getTransactionById); 

module.exports = router;
