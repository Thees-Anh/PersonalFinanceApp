require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/authRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const budgetRoutes = require('./routes/budgetRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/budgets', budgetRoutes);

app.get('/', (req, res) => {
  res.send('Personal Finance API is running...');
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/personalfinance')
  .then(async () => {
    console.log('MongoDB connected');
    // Seed Default Categories if they don't exist
    const Category = require('./models/Category');
    const defaultCategories = [
      { _id: '605c72ef2f8a4b0015b6d1a1', name: 'Food', icon: 'restaurant-outline', color: '#F59E0B', type: 'expense' },
      { _id: '605c72ef2f8a4b0015b6d1a2', name: 'Transport', icon: 'car-outline', color: '#3B82F6', type: 'expense' },
      { _id: '605c72ef2f8a4b0015b6d1a4', name: 'Entertainment', icon: 'film-outline', color: '#8B5CF6', type: 'expense' },
      { _id: '605c72ef2f8a4b0015b6d1a5', name: 'Shopping', icon: 'cart-outline', color: '#EC4899', type: 'expense' },
      { _id: '605c72ef2f8a4b0015b6d1a7', name: 'Health', icon: 'medical-outline', color: '#10B981', type: 'expense' },
      { _id: '605c72ef2f8a4b0015b6d1a3', name: 'Salary', icon: 'cash-outline', color: '#10B981', type: 'income' },
      { _id: '605c72ef2f8a4b0015b6d1a6', name: 'Investment', icon: 'trending-up-outline', color: '#14B8A6', type: 'income' },
    ];
    for (const cat of defaultCategories) {
      await Category.findByIdAndUpdate(cat._id, cat, { upsert: true });
    }
  })
  .catch(err => console.log(err));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
