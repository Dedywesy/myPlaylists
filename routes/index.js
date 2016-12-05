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
var ctrlLikes = require('./controllers/likes');

//Setup multer form multiform parsing
router.use(multer({dest: './uploads/'}).any());

/*Secured api routes use auth function
* A payload with the json webtoken must be provided
* */
/********** Profile ***************/
router.get('/profile/:id', auth, ctrlProfile.profileRead);

/*********Playlists****************/
//get a playlist by id
router.get('/playlist/:id', auth, ctrlPlaylists.getPlaylist);

/*******User's Playlists***********/
// get user's playlists
router.get('/userPlaylists/:id', auth, ctrlPlaylists.getUserPlaylists);
// create playlist
router.post('/playlist', auth, ctrlPlaylists.createPlaylist);
// edit playlist
router.put('/playlist', auth, ctrlPlaylists.editPlaylist);
//delete playlist
router.delete('/playlist/:id', auth, ctrlPlaylists.deletePlaylist);

/*******User's Likes*****************/
//get user liked playlists
router.get('/likes', auth, ctrlLikes.getUserLikes);
//"post" a like on a playlist
router.post('/likes', auth, ctrlLikes.likePlaylist);
//"delete" a like on a playlist
router.delete('likes/:id', auth, ctrlLikes.unlikePlaylist);

/**"Not secured" available without being logged in*/
/********Authentication****************/
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);
// get top playlists
router.get('/topPlaylists', ctrlPlaylists.getTopPlaylist);

module.exports = router;