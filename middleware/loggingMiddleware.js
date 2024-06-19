// middlewares/logging.js

const fs = require('fs');
const path = require('path');
const morgan = require('morgan');
const { fifoQueue,priorityQueue,roundRobinQueue } = require('../controllers/loadBalancerController');

const logStream = fs.createWriteStream(path.join(__dirname, '../logs/request.log'), { flags: 'a' });

// Define a custom logging format using morgan
const loggingMiddleware = morgan((tokens, req, res) => {
  const logEntry = [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    `Queue lengths - FIFO: ${fifoQueue.length()}, Priority: ${priorityQueue.length()}, RoundRobin: ${roundRobinQueue.length()}`,
  ].join(' ');

  // logStream.write(logEntry + '\n');
  console.log(logEntry);
  return logEntry;
}, { stream: logStream });

module.exports = loggingMiddleware;
