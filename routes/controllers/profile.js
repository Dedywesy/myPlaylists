var User = require('../models/users')

module.exports.profileRead = function(req, res) {

  if (!req.payload._id) {
    res.status(401).json({
      "message" : "UnauthorizedError: private profile"
    });
  } else {
    User.getByID(req.payload._id, function (err, user) {
       res.status(200).json(user);
    });
  }
};
