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
  	return this.hash === hash;
};

User.prototype.generateJwt = function() {
	var expiry = new Date();
	expiry.setDate(expiry.getDate() + 7);
    console.log("Generating jwt for user : ", this.ID);
	return jwt.sign({
		_id: this.ID,
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
 //TODO check email and name before

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
        if(!err && result.rows[0]){
           currentUser = userFromDB(result.rows[0]);
        }
        callback(err, currentUser);
    });
};

exports.getByID = function (id, callback) {
  console.log("User by id function");
  var table = "public.users";
  var where = '"ID" = ' + id;

  db.getQuery(table, where, function (err, result) {
     var currentUser;
     if(!err && result.rows[0]){
         currentUser = userFromDB(result.rows[0]);
     }
     callback(err, currentUser);
  });
};

function userFromDB(rawUser){
    console.log("UserFromDB");
    var user = new User(rawUser.ID, rawUser.Email, rawUser.Name, rawUser.Salt, rawUser.Hash);

    console.log(user);
    return user;
}