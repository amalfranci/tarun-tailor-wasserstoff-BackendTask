const express = require('express')
const app = express()
const PORT = 4000;



app.use(express.json())

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


app.listen(PORT, () => {
    
    console.log(`Mock Apis connected on port ${PORT}`)
})