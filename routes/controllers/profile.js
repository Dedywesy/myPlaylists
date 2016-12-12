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

module.exports.search = function (req, res) {
    console.log("Search User function");
    if(!req.query.q){
        res.status(401).json({
            "message": "Nothing to look for, please specify research query"
        });
        return;
    }

    User.search(req.query.q, function (error, results) {
        if(error){
            res.status(500).json(error);
        } else {
            res.status(200).json(results);
        }
    })
};
