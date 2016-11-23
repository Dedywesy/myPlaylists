var User = require('../models/users')

module.exports.profileRead = function(req, res) {
  console.log("Profile read function");
  console.log(req.payload);
  if (!req.payload._id) {
    console.err("No payload in the request !!");
    res.status(401).json({
      "message" : "UnauthorizedError: private profile"
    });
  } else {
    console.log("Getting user by ID");
    User.getByID(req.payload._id, function (err, user) {
       res.status(200).json(user);
    });
  }
};
