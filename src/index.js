const logger = require('./inits/logs')();
const app = require('./app');
const port = process.env.PORT;

app.listen(port, () => {
  logger.info('Server is running on port '.concat(port));
});
