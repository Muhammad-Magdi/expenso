const express = require('express');
const ExpenseController = require('./controller');
const auth = require('../users/auth');

const router = new express.Router();

/**
 * Create new expense
 * POST /api/users/me/expenses
 */
router.post('/', auth, ExpenseController.create);

/**
 * Read all Expenses
 * GET /api/users/me/expenses
 */
router.get('/', auth, ExpenseController.getAll);

/**
 * Read Expense by ID
 * GET /api/users/me/expenses/:expenseId
 */
router.get('/:expenseId', auth, ExpenseController.get);

/**
 * Update Expense
 * PUT /api/users/me/expenses/:expenseId
 */
router.put('/:expenseId', auth, ExpenseController.update);

/**
 * Delete Expense by
 * DELETE /api/users/me/expenses/:expenseId
 */
router.delete('/:expenseId', auth, ExpenseController.delete);

module.exports = router;
