const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const authMiddleware = require('../middleware/authMiddleware');

// Apply auth middleware to all transaction routes
router.use(authMiddleware);

router.post('/', transactionController.createTransaction);
router.get('/', transactionController.getTransactions);
router.put('/:id', transactionController.updateTransaction);
router.delete('/:id', transactionController.deleteTransaction);

module.exports = router;
