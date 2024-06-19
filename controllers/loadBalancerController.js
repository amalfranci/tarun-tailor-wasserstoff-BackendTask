const axios = require('axios');
const { routes } = require('../config/routes');
const logger = require('../utils/logger'); // Import Winston logger

// Round-robin index to track
let roundRobinIndex = 0;

// Class definition for Queue
class Queue {
  constructor() {
    this.queue = [];
  }

  enqueue(request) {
    this.queue.push(request);
  }

  dequeue() {
    return this.queue.shift();
  }

  isEmpty() {
    return this.queue.length === 0;
  }

  length() {
    return this.queue.length;
  }
}

// Three different types of queues
const fifoQueue = new Queue();
const priorityQueue = new Queue();
const roundRobinQueue = new Queue();

// Log current length of queues
const logQueueMetrics = () => {
  const logData = `Queue lengths - FIFO: ${fifoQueue.length()}, Priority: ${priorityQueue.length()}, RoundRobin: ${roundRobinQueue.length()}`;
  logger.info(logData); // Use Winston to log
};

// Function to route incoming request to the various queue
const routeRequest = (req, res) => {
  if (req.url.startsWith('/api1')) {
    fifoQueue.enqueue({ req, res });
  } else if (req.url.startsWith('/api2')) {
    priorityQueue.enqueue({ req, res });
  } else if (req.url.startsWith('/api3')) {
    roundRobinQueue.enqueue({ req, res });
  }
  processQueue();
};

// Function to process requests in the queues
const processQueue = async () => {
  logQueueMetrics();
  let targetUrl;

  // Process the FIFO queue
  if (!fifoQueue.isEmpty()) {
    const { req, res } = fifoQueue.dequeue();
    targetUrl = routes.find(route => route.path === '/api1').url;
    await sendRequest(req, res, targetUrl);
  } else if (!priorityQueue.isEmpty()) {
    const { req, res } = priorityQueue.dequeue();
    targetUrl = routes.find(route => route.path === '/api2').url;
    await sendRequest(req, res, targetUrl);
  } else if (!roundRobinQueue.isEmpty()) {
    const { req, res } = roundRobinQueue.dequeue();
    targetUrl = routes.find(route => route.path === '/api3').url;
    roundRobinIndex = (roundRobinIndex + 1) % routes.length;
    await sendRequest(req, res, targetUrl);
  }
};

// Function to send the actual request to target URL
const sendRequest = async (req, res, targetUrl) => {
  const start = Date.now();
  try {
    const response = await axios({
      method: req.method,
      url: targetUrl,
      data: req.body,
      headers: req.headers,
      timeout: 10000
    });
    const duration = Date.now() - start;
    logger.info(`Request to ${req.url} routed to ${targetUrl} - Duration: ${duration}`);
    res.status(response.status).json(response.data);
  } catch (error) {
    const errorMsg = `Error routing the request to ${targetUrl}: ${error.message}`;
    logger.error(errorMsg);
    res.status(500).json({ error: errorMsg });
  }
};

module.exports = { routeRequest, fifoQueue, priorityQueue, roundRobinQueue };
