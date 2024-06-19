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


app.get('/api1', (req, res) => {
    
    setTimeout(()=>res.json({message : "This response from API 1 "}),1000)  
})

app.get('/api2', (req, res) => {
    
    setTimeout(()=>res.json({message : "This response from API 2 "}),5000)  
})


//  using Toggle for sucess and error response

let errorTogglr = false;

app.get('/api3', (req, res) => {
    
    if (errorTogglr)
    {
        res.status(500).json({error: "Internal Server Error"})
    }
    else {
        res.json({message:"Response from API 3"})
    }
    errorTogglr= ! errorTogglr
})


app.use((req, res) => routeRequest(req, res));


app.listen(PORT, () => {
  console.log(`Load balancer running on port ${PORT}`);
});
