var express = require('express');
var multer = require('multer');
var router = express.Router();
var jwt = require('express-jwt');
var auth = jwt({
    secret: "MYSECRET", //TODO Remove from the code
    userProperty: 'payload'
});

var ctrlProfile = require('./controllers/profile');
var ctrlAuth = require('./controllers/authentication');
var ctrlPlaylists = require('./controllers/playlists');

//Setup multer form multiform parsing
router.use(multer({dest: './uploads/'}).any());

/*Secured api routes use auth function
* A payload with the json webtoken must be provided
* */
// profile
router.get('/profile', auth, ctrlProfile.profileRead);
// get playlists
router.get('/getPlaylists', auth, ctrlPlaylists.getPlaylists);
// create playlist
router.post('/newPlaylist', auth, ctrlPlaylists.createPlaylists);

/*"Not secured" available without being logged in*/
// authentication
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);

module.exports = router;