
const fs = require('fs');
const path = require('path');
const morgan = require('morgan');

const logStream = fs.createWriteStream(path.join(__dirname, '../logs/request.log'), { flags: 'a' });

const loggingMiddleware = morgan('combined', { stream: logStream });

module.exports = loggingMiddleware;
