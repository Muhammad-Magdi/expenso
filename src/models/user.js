const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
  tokens: [String],
});

userSchema.pre('save', async (next) => {
  const user = this;
  if (user.isModified('password')) {
    const salt = await bcrypt.genSalt(8);
    user.password = await bcrypt.hash(user.password, salt);
  }
  next();
});

userSchema.methods.findByCredentials = async function(email, password) {
  const user = await User.findOne({email});
  if(!user || !bcrypt.compare(password, user.password))
    throw new Error('Invalid Email and/or Password!');
  return user;
};

userSchema.methods.toJSON = function() {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.tokens;
  return userObject;
};

userSchema.methods.genAuthToken = async function() {
  const user = this;
  const token = jwt.sign({_id: user._id.toString()}, process.env.JWTSECRET);
  const salt = await bcrypt.genSalt(8);
  const hashedToken = await bcrypt.hash(token, salt);
  user.token.push(hashedToken);
  await user.save();
  return token;
};

const User = mongoose.model(userSchema);

module.exports = User;
