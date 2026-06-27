const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const authMiddleware = require('../middleware/authMiddleware');

// Apply auth middleware to all analytics routes
router.use(authMiddleware);

router.get('/summary', analyticsController.getMonthlySummary);
router.get('/budgets', analyticsController.getBudgetStatus);
router.get('/weekly-trends', analyticsController.getWeeklyTrends);

module.exports = router;
