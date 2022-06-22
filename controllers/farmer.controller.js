const { response } = require('express');
const model = require('../models/farmer.model');
const farmerService = require('../services/farmer.service')

async function getOTP(req, res) {
    const  mobile = req.params.mobile;
    const validate = validateMobile(mobile);
    if (!validate["success"]) {
        return res.json(validate)
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


async function getProfile(req, res) {
    const mobile = req.params.mobile;
    console.log("mobile", mobile,req.params.mobile );
    const validate = validateMobile(mobile);

    if (!validate["success"]) {
        return res.json(validate);
    }
    profile = await farmerService.getFarmerProfile(mobile);
    return res.json(profile);
}

async function getDevices(req, res) {
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

function validateMobile( mobile) {
    
    if (mobile === "") {
        return {"success": false, "message": 'Missing mobile number'};
    } else if (mobile.length != 10) {
        return { "success": false, "message": "Invalid Mobile Number, please enter 10 digits" };
    } else if (isNaN(mobile)) {
        return {"success": false, "message": "Invalid Mobile Number, please enter numeric value" };
    }
    return { "success": true};
}
module.exports = {
  postLogin,
  getOTP,
  getProfile,
  getDevices,
};