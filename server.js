const express = require('express');

const loggingMiddleware = require('./middleware/loggingMiddleware');
const { routeRequest } = require('./controllers/loadBalancerController');

const app = express();

app.use(loggingMiddleware);
app.use(express.json());

const PORT = 3000;
app.get('/', (req, res) => {
  res.send('Welcome to the Load Balancer Home Page');
});

app.use((req, res) => routeRequest(req, res));


app.listen(PORT, () => {
  console.log(`Load balancer running on port ${PORT}`);
});
