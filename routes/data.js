var express = require("express");
var router = express.Router();
var fs = require("fs")
var request = require("request");
var jwt = require("jwt-simple");

var Device = require("../models/device");
var Data = require("../models/data");
var User = require("../models/user");


router.post("/post_data", function(req, res) {
	var responseJson = {
		success: "false"
	}
	if (!req.body.hasOwnProperty("samples")) {
		responseJson.message = "Request missing samples parameter";
		res.status(201).send(JSON.stringify(responseJson));
	}
	else {
		var i;
		var failed = false;
		for (i = 0; i < req.body.samples.length; i++) {
			if (!req.body.samples[i].hasOwnProperty("deviceId")) {
				responseJson.message = "Request missing deviceId parameter";
				res.status(201).send(JSON.stringify(responseJson));
				failed = true;
			}
			else if (!req.body.samples[i].hasOwnProperty("uvIndex")) {
				responseJson.message = "Request missing uvIndex parameter";
				res.status(201).send(JSON.stringify(responseJson));
				failed = true;
			}
			else if (!req.body.samples[i].hasOwnProperty("latitude")) {
				responseJson.message = "Request missing latitude parameter";
				res.status(201).send(JSON.stringify(responseJson));
				failed = true;
			}
			else if (!req.body.samples[i].hasOwnProperty("longitude")) {
				responseJson.message = "Request missing longitude parameter";
				res.status(201).send(JSON.stringify(responseJson));
				failed = true;
			}
			else if (!req.body.samples[i].hasOwnProperty("timeStamp")) {
				responseJson.message = "Request missing timeStamp parameter";
				res.status(201).send(JSON.stringify(responseJson));
				failed = true;
			}
			if (failed == true) {
				i = req.body.samples.length;
			}
		}
		if (failed == false) {
//res.status(201).send(JSON.stringify(responseJson));
			responseJson.success = true;
//			Device.findOne({ deviceId: req.body.deviceId }, function(err, device) {
//				if (device == null) {
					//responseJson.message = "Device ID " + req.body.deviceId + " not recognized";
					//res.status(201).send(JSON.stringify(responseJson));
				//}
//				else {
					//FIXME: insert security apikey check
					
					//FIXME: insert API call to Google's geocoding API
					
					var dataPoint = new Data({
						deviceId: req.body.samples[0].deviceId,
						uvIndex: req.body.samples[0].uvIndex,
						timeStamp: req.body.samples[0].timeStamp
					});
					responseJson.message = "New data point recorded";
					//res.status(201).send(JSON.stringify(responseJson));
					dataPoint.save(function(err, newDataPoint) {
						if (err) {
							responseJson.message = "Error saving data in database: " + err;
							res.status(201).send(JSON.stringify(responseJson));
						}
						else {
							res.status(201).send(JSON.stringify(responseJson));
						}
					});
					//res.status(201).send(JSON.stringify(responseJson));
				//}
			//});
		}
	}
});

router.get("/:device_id", function(req, res) {
	var device_id = req.params.device_id;

	var responseJson = {
		average: 0,
		message: ""
	}

	//get number of data points by device
	var query = Data.find({ deviceId: device_id});

	query.exec(function(err, myData) {
		if (!err) {
			var k;
			var total = 0;
			var times = [];
			for (k = 0; k < myData.length; k++) {
				if (times.indexOf(myData[k].timeStamp) == -1) {
					times.push(myData[k].timeStamp);
					total += myData[k].uvIndex;
				}
			}
			responseJson.average = total / times.length;
			//console.log(query);
			//console.log(myData);
			responseJson.samples = myData;
			responseJson.message = "Found device";
			//console.log("Found document.");
			res.status(200).send(JSON.stringify(responseJson));
		}
		else {
			responseJson.message = "error";
			console.log("ERROR finding document.");
			res.status(200).send(JSON.stringify(responseJson));
		}
	});
	//res.status(200).send(JSON.stringify(responseJson));
});

module.exports = router;
