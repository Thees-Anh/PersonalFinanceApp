const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');
const Category = require('../models/Category');

// @desc    Get monthly summary (total income, total expense, expense breakdown)
// @route   GET /api/analytics/summary
// @access  Private
exports.getMonthlySummary = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({ message: 'Month and year are required' });
    }

    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

    const matchStage = {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        date: { $gte: startOfMonth, $lte: endOfMonth },
      },
    };

    // Aggregate totals for income and expense
    const totals = await Transaction.aggregate([
      matchStage,
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
        },
      },
    ]);

    let totalIncome = 0;
    let totalExpense = 0;
    totals.forEach((t) => {
      if (t._id === 'income') totalIncome = t.total;
      if (t._id === 'expense') totalExpense = t.total;
    });

    // Aggregate expenses by category
    const expenseMatchStage = {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        date: { $gte: startOfMonth, $lte: endOfMonth },
        type: 'expense',
      },
    };

    const expenseBreakdown = await Transaction.aggregate([
      expenseMatchStage,
      {
        $group: {
          _id: '$categoryId',
          total: { $sum: '$amount' },
        },
      },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'category',
        },
      },
      {
        $unwind: '$category',
      },
      {
        $project: {
          _id: 0,
          categoryId: '$_id',
          categoryName: '$category.name',
          categoryIcon: '$category.icon',
          categoryColor: '$category.color',
          total: 1,
        },
      },
      { $sort: { total: -1 } },
    ]);

    res.json({
      totalIncome,
      totalExpense,
      expenseBreakdown,
    });
  } catch (error) {
    console.error('Error fetching analytics summary:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get budget status (limit vs actual spending)
// @route   GET /api/analytics/budgets
// @access  Private
exports.getBudgetStatus = async (req, res) => {
  try {
    const userId = req.user.userId;
    let { month, year } = req.query;

    // Default to current month if not provided
    if (!month || !year) {
      const now = new Date();
      month = now.getMonth() + 1;
      year = now.getFullYear();
    } else {
      month = parseInt(month);
      year = parseInt(year);
    }

    // 1. Fetch budgets for the user for the given month/year
    const budgets = await Budget.find({ userId, month, year }).populate(
      'categoryId',
      'name icon color'
    );

    if (budgets.length === 0) {
      return res.json([]);
    }

    // 2. Fetch actual expenses for those categories in the given month/year
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

    const categoryIds = budgets.map((b) => b.categoryId._id);

    const expenses = await Transaction.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          categoryId: { $in: categoryIds },
          date: { $gte: startOfMonth, $lte: endOfMonth },
          type: 'expense',
        },
      },
      {
        $group: {
          _id: '$categoryId',
          totalSpent: { $sum: '$amount' },
        },
      },
    ]);

    // Create a map for quick lookup
    const spentMap = {};
    expenses.forEach((e) => {
      spentMap[e._id.toString()] = e.totalSpent;
    });

    // 3. Combine budget limit and actual spending
    const budgetStatus = budgets.map((b) => {
      const spent = spentMap[b.categoryId._id.toString()] || 0;
      return {
        budgetId: b._id,
        category: b.categoryId,
        limitAmount: b.limitAmount,
        spentAmount: spent,
        remainingAmount: b.limitAmount - spent,
        percentageUsed: b.limitAmount > 0 ? (spent / b.limitAmount) * 100 : 0,
      };
    });

    res.json(budgetStatus);
  } catch (error) {
    console.error('Error fetching budget status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get income vs expense for the last 7 days
// @route   GET /api/analytics/weekly-trends
// @access  Private
exports.getWeeklyTrends = async (req, res) => {
  try {
    const userId = req.user.userId;
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 6);
    startDate.setHours(0, 0, 0, 0);

    const matchStage = {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        date: { $gte: startDate, $lte: endDate },
      },
    };

    const trends = await Transaction.aggregate([
      matchStage,
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
            type: "$type"
          },
          total: { $sum: "$amount" }
        }
      }
    ]);

    // Format into an array of 7 days
    const result = [];
    for (let i = 0; i <= 6; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      // Use local date parts instead of toISOString() to avoid timezone shifting
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      
      const income = trends.find(t => t._id.date === dateStr && t._id.type === 'income')?.total || 0;
      const expense = trends.find(t => t._id.date === dateStr && t._id.type === 'expense')?.total || 0;
      
      result.push({
        date: dateStr,
        dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
        income,
        expense
      });
    }

    res.json(result);
  } catch (error) {
    console.error('Error fetching weekly trends:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
