var express = require('express');
var router = express.Router();
var Device = require("../models/device");
var fs = require('fs');
var jwt = require('jwt-simple');

function getNewApiKey() {
    var newApikey = "";
    var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 32; i++) {
        newApikey += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
    }

    return newApikey;
}

//Endpoint for registering a new device given a device ID and user email
//response sends the API key for the decice
router.post('/register', function(req, res, next){
    var secret = "twelveFilipinos";
    var responseJson = {
        registered: false,
        message: "",
        apiKey: "none"
    };
    
    var deviceExists = false;

    //get token from x-auth
    var token = req.headers["x-auth"];

    // decode this mf
    try {
        var decoded = jwt.decode(token, secret);

        //Make sure user didnt forget to put deviceID
        if(!req.body.hasOwnProperty("deviceId")){
            responseJson.message = "Missing deviceId.";
            res.status(400).json(responseJson);
            return;
        }

        //Now check if device has already been registered
        Device.findOne({deviceId: req.body.deviceId }, function(err, device) {
            if (device !== null){
                responseJson.message = "Device with ID: " + req.body.deviceId + " has already been registered.";
                res.status(400).json(responseJson);
            }
            else {
                //NEW APIKEY YOOO
                var newApiKey = getNewApiKey();
                //new device with id, email, apikey
                var newDevice = new Device({
                    deviceId: req.body.deviceId,
                    userEmail: decoded.email,
                    apiKey: newApiKey
                });

                //Time to save
                newDevice.save(function(err, newDevice){
                    if(err){
                        console.log("Error: " + err);
                        responseJson.message = err;
                        res.status(400).json(responseJson);
                    }
                    else{
                        responseJson.registered = true;
                        responseJson.apiKey = newApiKey;
                        responseJson.message = "Device " + req.body.deviceId + " was registered.";
                        res.status(201).json(responseJson);
                    }
                });
            }
        });
    } catch(exception) {
        responseJson.message = "Auth Error";
        console.log(exception);
        res.status(401).json(responseJson);
    }
});

router.get('/getDeviceID', function(req, res){
    var secret = "twelveFilipinos";
    var responseJson = {};
    var token = req.headers["x-auth"];

    try {
        var decode = jwt.decode(token, secret);

        Device.findOne({userEmail: decode.email}, function(err, device){
            if (device){
                responseJson.deviceID = device.deviceId;
                res.status(200).json(responseJson);
            }
            else{
                responseJson.message = "Cannot find device for User: " + decode.email;
                res.status(400).json(responseJson);
            }
        });
    }
    catch(exception) {
        responseJson.message = "Auth Error";
        console.log(exception);
        res.status(400).json(responseJson);
    }
});

module.exports = router;
