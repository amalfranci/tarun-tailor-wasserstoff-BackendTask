const morgan = require('morgan');
const logger = require('../utils/logger');
const { fifoQueue, priorityQueue, roundRobinQueue } = require('../controllers/loadBalancerController');

// Define a custom logging format using morgan
const loggingMiddleware = morgan((tokens, req, res) => {
  const logEntry = [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    `Queue lengths - FIFO: ${fifoQueue.length()}, Priority: ${priorityQueue.length()}, RoundRobin: ${roundRobinQueue.length()}`
  ].join(' ');

  logger.info(logEntry);
  return logEntry;
});

module.exports = loggingMiddleware;
