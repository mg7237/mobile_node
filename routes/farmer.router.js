const express = require('express');

const farmerController = require('../controllers/farmer.controller');

const farmerRouter = express.Router();

farmerRouter.use((req, res, next) => {
  console.log('ip address:', req.ip);
  next();
});
farmerRouter.get('/otp/:mobile', farmerController.getOTP);
farmerRouter.post('/login', farmerController.postLogin);
farmerRouter.get('/profile/:farmerID', farmerController.getProfile);
farmerRouter.get('/devices/:farmerID', farmerController.getDevices);

module.exports = farmerRouter;