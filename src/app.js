const express = require('express');
require('./inits/mongoose.js');

const app = express();

app.use(express.json());

module.exports = app;
