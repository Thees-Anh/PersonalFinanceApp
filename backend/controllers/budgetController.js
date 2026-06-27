const mongoose = require('mongoose');
const Budget = require('../models/Budget');

// @desc    Create a new budget
// @route   POST /api/budgets
// @access  Private
exports.createBudget = async (req, res) => {
  try {
    const { categoryId, limitAmount, month, year } = req.body;
    const userId = req.user.userId;

    if (!categoryId || !limitAmount || !month || !year) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if a budget already exists for this category in the given month/year
    const existingBudget = await Budget.findOne({
      userId,
      categoryId,
      month,
      year,
    });

    if (existingBudget) {
      return res.status(400).json({ message: 'Budget for this category already exists for the given month.' });
    }

    const budget = new Budget({
      userId,
      categoryId,
      limitAmount,
      month,
      year,
    });

    await budget.save();
    res.status(201).json(budget);
  } catch (error) {
    console.error('Error creating budget:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a budget
// @route   PUT /api/budgets/:id
// @access  Private
exports.updateBudget = async (req, res) => {
  try {
    const { id } = req.params;
    const { limitAmount } = req.body;
    const userId = req.user.userId;

    const budget = await Budget.findOne({ _id: id, userId });
    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    budget.limitAmount = limitAmount || budget.limitAmount;
    await budget.save();

    res.json(budget);
  } catch (error) {
    console.error('Error updating budget:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a budget
// @route   DELETE /api/budgets/:id
// @access  Private
exports.deleteBudget = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const budget = await Budget.findOne({ _id: id, userId });
    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    await budget.deleteOne();
    res.json({ message: 'Budget removed' });
  } catch (error) {
    console.error('Error deleting budget:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
