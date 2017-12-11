var express = require('express');
var router = express.Router();
var jwt = require("jwt-simple");
var bcrypt = require("bcrypt-nodejs");

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
    var responseJson = {};

    User.findOne({email: req.body.email}, function(err, user) {
        //Check to make sure theres not an error with mongo
        if (err) {
           responseJson.error = "mongodb error";
           res.status(401).json(responseJson);
        } else if (!user) {   //If there is no user
            responseJson.error = "User does not exist";
            res.status(401).json(responseJson);
        } else {
            // Compare the given password with the hashed password
            bcrypt.compare(req.body.password, user.password, function(err, valid) {
                if(err) {
                    responseJson.error = "error with bcrypt";
                    res.status(401).json(responseJson);
                }
                if (valid) {
                    var token = jwt.encode({email: req.body.email}, secret);
                    responseJson.token = token;
                    responseJson.fullName = user.fullName;
                    responseJson.redirect = "/uv_data.html";
                    res.status(201).json(responseJson);
                } else {
                    responseJson.error = "Wrong Password";
                }
            });
        }
    });
});

/* POST register a new user */
router.post('/register', function(req, res, next) {
    //hash the password
    console.log("here1");
    bcrypt.hash(req.body.password, null, null, function(err, hash){
        // new user
        console.log("here");
        var newUser = new User( {
            email: req.body.email,
            fullName: req.body.fullName,
            password: hash // hashed password
        });
        newUser.save(function(err, user){
            responseJson = { success: false,
                message: "",
            };
            if (err){
                responseJson.success = false;
                responseJson.message = err.errmsg;
                res.json( responeJson );
            }
            else {
                responseJson.success = true;
                responseJson.message = "Account for " + user.fullName + " has been created ";
                responseJson.redirect = "/signin.html";
                res.status(201).json( responseJson );
            }
        });
    });

});

router.post("/update", function (req, res, next) {
    var secret = "twelveFilipinos";
    var responseJson = {};

    //get token from x-auth
    var token = req.headers["x-auth"];

    //decode
    try{
        var decoded = jwt.decode(token, secret);

        if(req.body.hasOwnProperty("zip")){
            User.findOneAndUpdate({email: decoded.email}, {zip: req.body.zip}, function(err, user){
                if(err){
                    responseJson.success = false;
                    responseJson.message = err.errmsg;
                    res.status(401).json(responseJson);
                }else{
                    console.log(user);
                    responseJson.success = true;
                    responseJson.message = "Zip code for " + decoded.email + " has been updated";
                    res.status(200).json(responseJson);
                }
            });
        }
        else if(req.body.hasOwnProperty("password")){
            bcrypt.hash(req.body.password, null, null, function(err, hash){
                User.findOneAndUpdate({email:decoded.email}, {password: hash}, function(err, user){
                    if(err){
                        responseJson.success = false;
                        responseJson.message = err.errmsg;
                        res.status(401).json(responseJson);
                    }
                    else{
                        console.log(user);
                        responseJson.success = true;
                        responseJson.message = "Password for " + decoded.email + " has been updated";
                        res.status(200).json(responseJson);
                    }
                });
            });
        }
        else {
            responseJson.success = false;
            responseJson.message = "No update parameters given";
            res.status(401).json(responseJson);
        }
    } catch(exception) {
        responseJson.success = false;
        responseJson.message = "Auth error";
        res.status(401).json(responseJson);
    }
        
});

module.exports = router;
