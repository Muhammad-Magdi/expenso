const jwt = require('jsonwebtoken');
const User = require('../models/user');
const status = require('http-status');

module.exports = async function(req, res, next) {
  let token = req.header('Authorization');
  if (!token) {
    return res.status(status.BAD_REQUEST).send('Token is required!');
  }
  token = token.replace('Bearer ', '');
  jwt.verify(token, process.env.JWT_SECRET, async function(err, {_id}) {
    if (err) {
      return res.status(status.UNAUTHORIZED).send(err.message);
    }
    try {
      req.user = await User.findById(_id);
      if (!req.user) {
        return res.status(status.UNAUTHORIZED).send('Invalid token!');
      }
      next();
    } catch (e) {
      return res.status(status.INTERNAL_SERVER_ERROR).send(e.message);
    }
  });
};
