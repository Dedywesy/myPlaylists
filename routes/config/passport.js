var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/users');

passport.use(new LocalStrategy({
        usernameField: 'email'
    },
    function (username, password, done) {
        User.getByEmail(username, function (err, user) {
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