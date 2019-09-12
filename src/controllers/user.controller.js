const User = require('../models/user');
const status = require('http-status');

/** */
class UserController {
  /**
   * @static
   * @param {Object} req - request
   * @param {Object} res - response
   * @param {Function} next - next
   */
  static async create(req, res, next) {
    // validate req.body
    const {error} = User.validate(req.body);
    if (error) {
      return res.status(status.BAD_REQUEST).json(error.message);
    }
    const user = new User(req.body);
    try {
      await user.save();
      const token = user.genAuthToken();
      return res.status(status.CREATED).header('x-token', token).json(user);
    } catch (e) {
      return res.status(status.BAD_REQUEST).json(e.message);
    }
  }

  /**
   * @static
   * @param {Object} req - request
   * @param {Object} res - response
   * @param {Function} next - next
   */
  static async login(req, res, next) {
    // validation
    const {error} = User.validate(req.body);
    if (error) {
      return res.status(status.BAD_REQUEST).send(error.message);
    }
    const {email, password} = req.body;
    try {
      const user = await User.findByCredentials(email, password);
      if (!user) {
        return res.status(status.BAD_REQUEST)
            .json('Invalid email and/or password!');
      }
      const token = user.genAuthToken();
      return res.status(status.OK).header('x-token', token).json(user);
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
      return res.status(status.OK).json(req.user);
    } catch (e) {
      return res.status(status.INTERNAL_SERVER_ERROR).json(e.message);
    }
  }

  /**
   * @static
   * @param {Object} req - request
   * @param {*} res - response
   * @param {*} next - next
   */
  static async update(req, res, next) {
    const updates = Object.keys(req.body);
    if (!updates.every((update) => User.updatableFields.includes(update))) {
      return res.status(status.BAD_REQUEST)
          .send('These Fields are not updatable!');
    }
    try {
      updates.forEach((update) => req.user[update] = req.body[update]);
      await req.user.save();
      return res.status(status.OK).json(req.user);
    } catch (e) {
      return res.status(status.INTERNAL_SERVER_ERROR).json(e.message);
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
      await req.user.remove();
      return res.status(status.NO_CONTENT).send();
    } catch (e) {
      return res.status(status.INTERNAL_SERVER_ERROR).send(e.message);
    }
  }
};

module.exports = UserController;
