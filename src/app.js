const express = require('express');
require('./inits/mongoose.js')();
const user = require('./components/users/router');
const expense = require('./components/expenses/router');

const app = express();

app.use(express.json());
app.use('/api/users', user);
app.use('/api/users/me/expenses', expense);

module.exports = app;
