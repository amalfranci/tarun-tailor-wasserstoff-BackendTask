const express = require('express')
const app = express()
const PORT = 4000

app.use(express.json())

app.get('/api1', (req, res) => {
    
    setTimeout(() => res.json({ message: "Response from AP1 1" }), 1000);

})

app.get('/api2', (req, res) => {
    res.json({message:'Response from API 2'})
})

app.post('/graphql', (req, res) => {
    setTimeout(()=>res.json({data:{message:'Response from GRAPHQL API'}}),500)
})

app.listen(PORT, () => {
    
    console.log(`mock APIs runing on port ${PORT}`)
})