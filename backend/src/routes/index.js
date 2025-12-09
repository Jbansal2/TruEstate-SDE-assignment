const express = require('express');
const router = express.Router();

const transactionsRouter = require('./transactions');

router.use('/transactions', transactionsRouter);

module.exports = router;
