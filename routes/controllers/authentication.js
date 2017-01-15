var passport = require('passport');
var User = require('../models/users');
var Images = require('../models/images');
var fs = require('fs');


var sendJSONresponse = function (res, status, content) {
    console.log("Send JSON Response function");
    res.status(status);
    res.json(content);
};

module.exports.register = function (req, res) {
    console.log("Register function");
    if (!req.body.name || !req.body.email || !req.body.password) {
        sendJSONresponse(res, 400, {
            "message": "All fields required"
        });
        return;
    }

    var onUserNameOK = function () {
        if(!req.files[0]){
            sendJSONresponse(res, 400, {
                "message" : "No file attached to this account creation"
            });
            return
        }
        if(req.files[0].mimetype.substring(0, 5) != 'image'){
            sendJSONresponse(res, 401, {
                "message" : "Only image files are allowed in file field"
            });
            fs.unlink(req.files[0].path, function () {
            });
            return;
        }

        //Save profile picture;
        Images.saveImage(req.files[0].path, function (result) {
            fs.unlink(req.files[0].path, function () {
            });
            if (!result) { //error
                sendJSONresponse("", 500, {
                    "message": "Error while uploading profile picture"
                });
            }
            else {
                var user = User.createUser(req.body.email, req.body.name, req.body.password, result);
                console.log("User created!");
                User.save(user, function (err, result) {
                    if(!err){
                        console.log("generating token...");
                        user.ID = result.rows[0].ID;
                        var token;
                        token = user.generateJwt();
                        res.status(200);
                        res.json({
                            "token": token
                        });
                    }
                });
            }
        });
    };

    var onEmailOK = function () {
        User.getByName(req.body.name, function (err, result) {
            if (result){
                sendJSONresponse(res, 401, {
                    "message": "An account already exists with this pseudo"
                });
            }
            else{
                onUserNameOK();
            }
        });
    };

    User.getByEmail(req.body.email, function (err, result) {
        if (result){
            sendJSONresponse(res, 500, {
                "message": "An account already exists with this email"
            })
        }
        else {
            onEmailOK();
        }
    });
};

module.exports.login = function (req, res) {

    if (!req.body.email || !req.body.password) {
        sendJSONresponse(res, 400, {
            "message": "All fields required"
        });
        return;
    }
    console.log("getting to authenticate");
    passport.authenticate('local', function (err, user, info) {
        var token;
        console.log("Authenticating");

        // If Passport throws/catches an error
        if (err) {
            res.status(401).json(err);
            return;
        }

        // If a user is found
        if (user) {
            console.log("User found !");
            token = user.generateJwt();
            res.status(200);
            res.json({
                "token": token
            });
        } else {
            // If user is not found
            console.log("User not found ! ");
            sendJSONresponse(res, 400, {
                "message": "Username and password not matching"
            });
        }
    })(req, res);

};