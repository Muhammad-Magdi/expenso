const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports = async function(req, res, next) {
  let token = req.header('Authorization');
  if (!token) {
    return res.status(400).send('Token is required!');
  }
  token = token.replace('Bearer ', '');
  jwt.verify(token, process.env.JWT_SECRET, async function(err, {_id}) {
    if (err) {
      return res.status(401).json(err.message);
    }
    try {
      req.user = await User.findById(_id);
      if (!req.user) {
        return res.status(401).send('Invalid token!');
      }
      next();
    } catch (e) {
      return res.status(500).json(e.message);
    }
  });
};
