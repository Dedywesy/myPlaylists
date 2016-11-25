var passport = require('passport');
var User = require('../models/users');
//var db = require ('../models/db');

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

module.exports.register = function(req, res) {

  if(!req.body.name || !req.body.email || !req.body.password) {
     sendJSONresponse(res, 400, {
       "message": "All fields required"
     });
     return;
  }
  var user = User.createUser(req.body.email, req.body.name, req.body.password);

  console.log("User created!");
  User.save(user, function(err) {
    console.log("generating token...")
    var token;
    token = user.generateJwt();
    res.status(200);
    res.json({
      "token" : token
    });
  });

};

module.exports.login = function(req, res) {

  if(!req.body.email || !req.body.password) {
     sendJSONresponse(res, 400, {
       "message": "All fields required"
     });
     return;
  }
  console.log("getting to authenticate");
  passport.authenticate('local', function(err, user, info){
    var token;

    // If Passport throws/catches an error
    if (err) {
      res.status(404).json(err);
      return;
    }

    // If a user is found
    if(user){
        console.log("User found !");
      token = user.generateJwt();
      res.status(200);
      res.json({
        "token" : token
      });
    } else {
      // If user is not found
        console.log("User not found ! ");
      res.status(401).json(info);
    }
  })(req, res);

};