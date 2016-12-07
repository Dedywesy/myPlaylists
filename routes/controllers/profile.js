var User = require('../models/users');

module.exports.profileRead = function (req, res) {
    console.log("Profile read function");
    if (!req.payload._id || !req.params.id) {
        console.error("No payload in the request !!");
        res.status(401).json({
            "message": "UnauthorizedError: private profile or missing profile id"
        });
    } else {
        console.log("Getting user by ID");
        User.getByID(req.params.id, function (err, user) {
            if (req.payload._id != req.params.id) {
                user.email = null;

            }
            user.salt = null;
            user.hash = null;
            res.status(200).json(user);//todo handle error
        });
    }
};
