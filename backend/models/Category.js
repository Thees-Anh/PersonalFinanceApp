const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['income', 'expense'],
      required: true,
    },
    icon: {
      type: String,
    },
    color: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Category', categorySchema);
