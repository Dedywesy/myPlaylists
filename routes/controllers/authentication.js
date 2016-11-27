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
    //TODO check name/email availability (email most important)
    if (!req.body.name || !req.body.email || !req.body.password) {
        sendJSONresponse(res, 400, {
            "message": "All fields required"
        });
        return;
    }

    //Save profile picture;
    Images.saveImage(req.files[0].path, function (result) {
        fs.unlink(req.files[0].path, function () {
        });
        if (!result) { //error
            sendJSONresponse(error, 500, {
                "message": "Error while uploading profile picture"
            });
        }
        else {
            var user = User.createUser(req.body.email, req.body.name, req.body.password, result);
            console.log("User created!");
            User.save(user, function (err, result) {
                console.log("generating token...");
                if(!err){
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
            res.status(404).json(err);
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
            res.status(401).json(info);
        }
    })(req, res);

};