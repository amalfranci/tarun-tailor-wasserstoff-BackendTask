const axios = require('axios')
const { routes, randomRoutes } = require('../config/routes');
const { response } = require('express');

let roundRobinIndex = 0;

const routeRequest = async (req, res) => {
    
    let targetUrl;

    // Dynamic Routing Logic 

    const route = routes.find(r => req.url.startsWith(r.path))
    if (route)
    {
        targetUrl=route.url
    }
    else {
        targetUrl = randomRoutes[roundRobinIndex];

        //  round-robin logic
        roundRobinIndex = (roundRobinIndex + 1) % randomRoutes.length;  
    }
    try {
        
        const reaponse = await axios({
            
            method: req.method,
            url: targetUrl,
            data: req.body,
            headers:req.headers,
        })
        res.status(reaponse.status).json(response.data)
    }
    catch (error)
    {
        res.status(500).json({error:"Error routing the request"})
    }
}

module.export={routeRequest}