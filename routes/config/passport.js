var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/users');

passport.use(new LocalStrategy({
        usernameField: 'email'
    },
    function (username, password, done) {
        console.log(password + username);
        User.getByEmail(username, function (err, user) {
            /*console.log("err " + err);
             console.log("user " + user);*/
            if (err) {
                console.error("Error with getByEmail");
                return done(err);
            }
            // Return if user not found in database
            if (!user) {
                console.error("No user found with this email");
                return done(null, false, {
                    message: 'User not found'
                });
            }
            console.log("User exists");
            // Return if password is wrong
            if (!user.validPassword(password)) {
                return done(null, false, {
                    message: 'Password is wrong'
                });
            }
            // If credentials are correct, return the user object
            console.log("user authenticated !!");
            return done(null, user);
        });
    }
));