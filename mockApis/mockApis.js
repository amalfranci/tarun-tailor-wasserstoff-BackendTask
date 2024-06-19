// mockApis.js
const express = require('express');
const app = express();
const PORT = 4000;

app.use(express.json());

app.get('/api1', (req, res) => {
    setTimeout(() => res.json({ message: "Response from API 1" }), 1000);
});

app.get('/api2', (req, res) => {
    setTimeout(() => res.json({ message: "Response from API 2" }), 6000);  // Simulate slow response
});

let errorToggle = false;
app.get('/api3', (req, res) => {
    if (errorToggle) {
        res.status(500).json({ error: 'Internal Server Error' });
    } else {
        res.json({ message: 'Response from API 3' });
    }
    errorToggle = !errorToggle; // Toggle between success and error responses
});

app.listen(PORT, () => {
    console.log(`Mock APIs running on port ${PORT}`);
});
