const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Joi = require('joi');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    max: 256,
    trim: true,
    lowercase: true,
    required: true,
    unique: true,
    index: true,
  },
  password: {
    type: String,
    min: 8,
    max: 1024,
    required: true,
  },
});

userSchema.pre('save', async function(next) {
  const user = this;
  if (user.isModified('password')) {
    const salt = await bcrypt.genSalt(8);
    user.password = await bcrypt.hash(user.password, salt);
  }
  next();
});

userSchema.methods.toJSON = function() {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.tokens;
  return userObject;
};

userSchema.methods.genAuthToken = function() {
  const user = this;
  const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET);
  return token;
};

const joiValidationSchema = {
  email: Joi.string().required().email().max(256),
  password: Joi.string().required().min(8).max(256),
};

userSchema.statics.findByCredentials = async function(email, password) {
  try {
    let user = await User.findOne({email});
    if (!user || !await bcrypt.compare(password, user.password)) {
      user = null;
    }
    return user;
  } catch (e) {
    throw new Error(e);
  }
};

userSchema.statics.validate = function(user) {
  return Joi.validate(user, joiValidationSchema);
};

userSchema.statics.updatableFields = [
  'password',
];

const User = mongoose.model('User', userSchema);

module.exports = User;
