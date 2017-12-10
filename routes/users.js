var express = require('express');
var router = express.Router();
var jwt = require("jwt-simple");

var Device = require("../models/device");
var Data = require("../models/data");
var User = require("../models/user");

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post("/signin", function (req, res, next) {
    var secret = "twelveFilipinos";
    var payload = req.body.email;
    var responseJson = {
        error: "no error"
    };
    User.findOne({email: req.body.email, password: req.body.password}, function(err, user) {
       if (!err) {
           var token = jwt.encode(payload, secret);
           responseJson.token = token;
           
           responseJson.redirect = "uv_data.html";
                
           res.status(201).send(JSON.stringify(responseJson));
       }
       else {
           responseJson.error = "Invalid email/password";
       }
    });
});

module.exports = router;
