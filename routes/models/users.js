var pg = require('pg');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var db = require('./db')



function User(ID, email, name, salt, hash){
	this.ID = ID;
	this.email = email;
	this.name = name;
	this.salt = salt;
	this.hash = hash;
	//todo ProfilePic
}

var exports = module.exports = {};

/*
exports.User = function() {
    console.log("creating user object");
    this.salt = null;
    this.hash = null;
    this.email = null;
    this.name = null;
};
*/
exports.createUser = function(email, name, password) {
    var user = new User(null, email, name, null, null);
    user.setPassword(password);
    return user;
}



User.prototype.setPassword =  function(password) {
	this.salt = crypto.randomBytes(16).toString('hex');
  	this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};

User.prototype.validPassword = function(password) {
	var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
    console.log("In valid password, salt is ", this.salt);
	console.log("In valid password, hash is ", hash);
  	return this.hash === hash;
};

User.prototype.generateJwt = function() {
	var expiry = new Date();
	expiry.setDate(expiry.getDate() + 7);

	return jwt.sign({
		_id: this._id,
		email: this.email,
		name: this.name,
		exp: parseInt(expiry.getTime()/1000)

	}, "MYSECRET"); //TODO GET OUT OF THE CODE
};

exports.save = function(user, callback) {
    console.log("user save function");
    var table = "public.users";
    var toInsert =' ("Salt", "Name", "Email", "Hash") values ( \'' +
        user.salt + '\' , \'' + user.name  + '\' , \'' +
        user.email + '\' , \'' + user.hash + '\')';
    /*var returnTuple = db.insertQuery(table, toInsert); //TODO check email before
    if(returnTuple[0]!=null){
        console.error("error while adding user to database");
    }
    callback(returnTuple[0]);*/

    db.insertQuery(table, toInsert, function (err, returnTuple) {
        if(err){
            console.log("error while adding user to db");
        }
        callback(err);
    })
};

exports.getByEmail = function(email, callback){
    console.log('User by email function');
    var table = "public.users";
    var where = '"Email" = ' + "'" + email + "'";

    db.getQuery(table, where, function (err, result) {
        var currentUser;
        console.log("Result in User : ");
        console.log(result);
        if(!err && result[0]){
           currentUser = userFromDB(result[0]);
        }
        callback(err, currentUser);
    });

};

function userFromDB(rawUser){
    console.log("UserFromDB");
    //var jsonContent = JSON.parse(jSonUser);
/*    console.log("Name : ", rawUser.Name);
    console.log("Email : ", rawUser.Email);*/
    var user = new User(rawUser.ID, rawUser.Email, rawUser.Name, rawUser.Salt, rawUser.Hash);

    console.log(user);
    return user;
}