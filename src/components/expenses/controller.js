const Expense = require('./model');
const status = require('http-status');
const Joi = require('joi');

/** */
class ExpenseController {
  /**
   * @static
   * @param {Object} req - request
   * @param {Object} res - response
   * @param {Function} next - next
   */
  static async create(req, res, next) {
    // validate
    const {error} = Expense.validate(req.body);
    if (error) {
      return res.status(status.BAD_REQUEST).send(error.message);
    }
    const expense = new Expense(req.body);
    expense.owner = req.user._id;
    try {
      await expense.save();
      return res.status(status.OK).json(expense);
    } catch (e) {
      return res.status(status.INTERNAL_SERVER_ERROR).send(e.message);
    }
  }

  /**
   * @static
   * @param {Object} req - request
   * @param {Object} res - response
   * @param {Function} next - next
   */
  static async getAll(req, res, next) {
    const minDate = new Date(-8640000000000000);
    const maxDate = new Date(8639999999999999);
    const match = {
      baseDate: {$gte: minDate, $lte: maxDate},
    };
    if (req.query.from) {
      const {error} = Joi.date().validate(req.query.from);
      if (error) {
        return res.status(status.BAD_REQUEST).send(error.message);
      }
      match.baseDate.$gte = new Date(req.query.from);
    }
    if (req.query.to) {
      const {error} = Joi.date().validate(req.query.to);
      if (error) {
        return res.status(status.BAD_REQUEST).send(error.message);
      }
      match.baseDate.$lte = new Date(req.query.to);
    }

    try {
      const expenses = await Expense.find({owner: req.user._id, ...match});
      return res.status(status.OK).json(expenses);
    } catch (e) {
      return res.status(status.INTERNAL_SERVER_ERROR).send(e.message);
    }
  }

  /**
   * @static
   * @param {Object} req - request
   * @param {Object} res - response
   * @param {Function} next - next
   */
  static async get(req, res, next) {
    try {
      const expense = await Expense.findById(req.params.expenseId);
      if (!expense) {
        return res.status(status.BAD_REQUEST).send('Invalid Id');
      } else if (!expense.owner.equals(req.user._id)) {
        return res.status(status.FORBIDDEN).send('Not Authorized!');
      }
      return res.status(status.OK).json(expense);
    } catch (e) {
      return res.status(status.INTERNAL_SERVER_ERROR).send(e.message);
    }
  }

  /**
   * @static
   * @param {Object} req - request
   * @param {Object} res - response
   * @param {Function} next - next
   */
  static async update(req, res, next) {
    const {error} = Expense.validate(req.body);
    if (error) {
      return res.status(status.BAD_REQUEST).send(error.message);
    }
    const updates = Object.keys(req.body);
    if (!updates.every((update) => Expense.editableFields.includes(update))) {
      return res.status(status.BAD_REQUEST)
          .send('These Fields are not updatable');
    }
    try {
      const expense = await Expense.findById(req.params.expenseId);
      if (!expense) {
        return res.status(status.BAD_REQUEST).send('Invalid Id');
      } else if (!expense.owner.equals(req.user._id)) {
        return res.status(status.FORBIDDEN).send('Not Authorized!');
      }
      updates.forEach((update) => expense[update] = req.body[update]);
      await expense.save();
      return res.status(status.OK).json(expense);
    } catch (e) {
      return res.status(status.INTERNAL_SERVER_ERROR).send(e.message);
    }
  }

  /**
   * @static
   * @param {Object} req - request
   * @param {Object} res - response
   * @param {Function} next - next
   */
  static async delete(req, res, next) {
    try {
      const expense = await Expense.findById(req.params.expenseId);
      if (!expense) {
        return res.status(status.BAD_REQUEST).send('Invalid Id!');
      } else if (!expense.owner.equals(req.user._id)) {
        return res.status(status.FORBIDDEN).send('Not Authorized!');
      }
      await expense.delete();
      return res.status(status.NO_CONTENT).send();
    } catch (e) {
      return res.status(status.INTERNAL_SERVER_ERROR).send(e.message);
    }
  }
}

module.exports = ExpenseController;
