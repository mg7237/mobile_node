const { response } = require('express');
const express = require('express');
const path = require('path');

const farmerRouter = require('./routes/farmer.router');

const app = express();

const PORT = 3000;

app.use((req, res, next) => {
    const start = Date.now();
    if (!validateAPI(req)) {
        return res.status(404).send({"error:" : "Invalid API KEY... Very sorry! Something went wrong. Please try again later"});
    }
  next();
  const delta = Date.now() - start;
    console.log(`${req.method} ${req.baseUrl}${req.url} ${delta}ms`);
    return response;
});

function  validateAPI(request)  {
    if (request.headers.API_KEY === '12345678') {
        console.log('right'); 
        return false;
    } else {
        console.log('left');
        return true;
    }
}

app.use(express.json());

app.get('/', (req, res) => {
    res.json({success: false})
    res.status(200).send({ "message": "Welcome to the machine!" });
});
  
app.use('/farmer', farmerRouter);

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}...`);
});