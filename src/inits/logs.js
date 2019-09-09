const winston = require('winston');
require('winston-mongodb');

module.exports = function() {
  const logger = winston.createLogger({
    transports: [
      new winston.transports.File({
        filename: 'logfile.log',
      }),
      new winston.transports.MongoDB({
        db: process.env.DB,
        level: 'info',
      }),
      new winston.transports.Console(),
    ],
  });
  return logger;
};
