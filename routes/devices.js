var express = require('express');
var router = express.Router();
var Device = require("../models/device");
var fs = require('fs');

function getNewApikey() {
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
    var responseJson = {
        registered: false,
        message: "",
        apiKey: "none"
    };
    
    var deviceExists = false;

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
            newApiKey = getNewApiKey();
            //new device with id, email, apikey
            var newDevice = new Device({
                deviceId: req.body.deviceId,
                userEmail: "test@notreal.com",
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
});

module.exports = router;
