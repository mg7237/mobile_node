const { response } = require('express');
const sql = require('mssql');
const model = require('../models/farmer.model');
const farmerService = require('../services/farmer.service')

async function getOTP(req, res) {
    let mobile = req.params.mobile;
    if (mobile === "") {
        return res.status(400).json({
            error: 'Missing mobile number'
        });
    } else if (mobile.length != 10) {
        return res.json({ "success": false, "error": "Invalid Mobile Number, please enter 10 digits" });
    } else if (isNaN(mobile)) {
        return res.json({ "success": false, "error": "Invalid Mobile Number, please enter numeric value" });
    }
    
    const otp = await farmerService.generateOTP(mobile);
    console.log('getOTP', typeof(otp), otp);

    if (otp === 0 || otp === "" || otp === undefined || otp == null) {
        return res.json({ "success": false, "error": "No valid farmer found with the provided mobile number. Please correct and retry." });
    } else if (otp === -1) {
        return res.json({ "success": false, "error": "OTP not sent, please try again later." });
    }
    return res.json({ "success": true, "data": { "otp": otp } });
}


function getProfile(req, res) {
    console.log('get profile');
    res.status(200).json({"MMS":"MMT"});
}

function getDevices(req, res) {
      console.log('get devices');
  const farmerId = Number(req.params.farmerId);

 res.status(200).json({
      error: 'Friend does not exist'
    });
}

function postLogin(req, res) {
    console.log('post pro');
    res.status(200).send({"MMS":"MMT"});
}
module.exports = {
  postLogin,
  getOTP,
  getProfile,
  getDevices,
};