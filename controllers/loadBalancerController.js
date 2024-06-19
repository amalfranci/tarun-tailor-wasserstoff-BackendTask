// controllers/loadBalancerController.js
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { routes } = require('../config/routes');

let roundRobinIndex = 0;

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

const fifoQueue = new Queue();
const priorityQueue = new Queue();
const roundRobinQueue = new Queue();

const logStream = fs.createWriteStream(path.join(__dirname, '../logs/request.log'), { flags: 'a' });

const logQueueMetrics = () => {
  const logData = `Queue lengths - FIFO: ${fifoQueue.length()}, Priority: ${priorityQueue.length()}, RoundRobin: ${roundRobinQueue.length()}\n`;
  logStream.write(logData);
};

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

const processQueue = async () => {
  logQueueMetrics();
  let targetUrl;

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

const sendRequest = async (req, res, targetUrl) => {
  const start = Date.now();
  try {
    const response = await axios({
      method: req.method,
      url: targetUrl,
      data: req.body,
      headers: req.headers,
      timeout: 10000 // Further increase timeout to 10 seconds
    });
    const duration = Date.now() - start;
    logStream.write(`Request to ${req.url} routed to ${targetUrl} - Duration: ${duration}ms\n`);
    res.status(response.status).json(response.data);
  } catch (error) {
    const errorMsg = `Error routing the request to ${targetUrl}: ${error.message}`;
    logStream.write(`${errorMsg}\n`);
    res.status(500).json({ error: errorMsg });
  }
};

module.exports = { routeRequest, fifoQueue, priorityQueue, roundRobinQueue };
