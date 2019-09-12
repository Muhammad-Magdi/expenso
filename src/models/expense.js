const mongoose = require('mongoose');
const Joi = require('joi');

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
  period: {
    type: Number,
    min: 1,
  },
  owner: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
});

expenseSchema.methods.toJSON = function() {
  const expense = this;
  const expenseObject = expense.toObject();
  delete expenseObject.owner;
  return expenseObject;
};

const joiExpenseSchema = {
  name: Joi.string().max(256),
  notes: Joi.string().max(1024),
  baseDate: Joi.date(),
  periodicState: Joi.string().valid(availablePeriods),
  period: Joi.number().min(1),
};

expenseSchema.statics.validate = function(expense) {
  return Joi.validate(expense, joiExpenseSchema);
};

expenseSchema.statics.editableFields = [
  'name',
  'notes',
  'baseDate',
  'periodicState',
  'period',
];

const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;
