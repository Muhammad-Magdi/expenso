const express = require('express');
require('./inits/mongoose.js')();
const user = require('./routes/user');

const app = express();

app.use(express.json());
app.use('/api/users', user);

module.exports = app;
