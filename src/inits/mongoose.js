const mongoose = require('mongoose');

module.exports = function(){
  mongoose.connect(process.env.DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
  });
};
