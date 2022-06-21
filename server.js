const express = require('express');
const app = require("./app");
const port = 3000;

app.use(express.json());
const farmerRouter = require('./routes/farmer.router');
app.use(farmerRouter);
app.use((req, res, next) => {
    const start = Date.now();
    // if (!validateAPI(req)) {
    //     return res.status(404).send({"error:" : "Invalid API KEY... Very sorry! Something went wrong. Please try again later"});
    // }
  next();
  const delta = Date.now() - start;
    console.log(`${req.method} ${req.baseUrl}${req.url} ${delta}ms`);
    return;
});

app.listen(port, () => console.log(`The server is listening on port ${port}`));