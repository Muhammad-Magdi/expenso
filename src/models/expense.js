const mongoose = require('mongoose');

const availablePeriods = ['none', 'daily', 'weekly', 'monthly', 'yearly'];

const expenseSchema = new mongoose.Schema({
  name: {
    type: String,
    max: 256,
  },
  notes: {
    type: String,
    max: 1024,
  },
  baseDate: {
    type: Date,
    default: Date.now,
    required: true,
    index: true,
  },
  periodicState: {
    type: String,
    enum: availablePeriods,
    default: 'none',
  },
  // Only used when the periodicState is not 'none'
  period: Number,
  owner:{
     type: mongoose.Types.ObjectId,
     required: true,
  }
});

const Expense = mongoose.model(expenseSchema);

module.exports = Expense;
