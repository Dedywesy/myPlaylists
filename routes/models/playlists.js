var pg = require('pg');
var db = require('./db')


function Playlist(ID, userId, isPublic, name, description, jsonPlaylist) {
    this.ID = ID;
    this.userId = userId ;
    this.isPublic = isPublic;
    this.name = name;
    this.description = description;
    this.jsonPlaylist = jsonPlaylist;
}

var exports = module.exports = {};

exports.createPlaylist = function (userId, isPublic, name, description) {
    //New playlist is public
    return new Playlist(null, userId, isPublic, name, description, null);
};

exports.save = function (playlist, callback) {
    console.log("playlist save function");
    var table = "public.playlists";
    var toInsert = ' ("UserID", "IsPublic", "Name", "Description") values ( \'' +
        playlist.userId + '\' , \'' + playlist.isPublic + '\' , \'' +
        playlist.name + '\' , \'' + playlist.description + '\')';

    db.insertQuery(table, toInsert, function (err, result) {
        if (err) {
            console.log("error while adding playlist to db");
        }
        callback(err, result);
    })
};

exports.getAllPlaylists = function (userID, callback) {
    console.log('Get all playlists function');
    var table = "public.playlists";
    var where = '"UserID" = ' + "'" + userID + "'";
    var results = [];

    db.getQuery(table, where, function (err, result) {
        if (!err && result.rows[0]) {
            for(var i = 0,  len = result.rows.length; i < len; i++){
                var pl = playlistFromDB(result.rows[i]);
                results.push(pl);
            }
        }
        callback(err, results);
    });
};

exports.getPublicPlaylists = function (userID, callback){
    console.log('Get public playlists function');
    var table = "public.playlists";
    var where = '"UserID" = ' + "'" + userID + "' AND IsPublic is true";
    var results = [];

    db.getQuery(table, where, function (err, result) {
        if (!err && result.rows[0]) {
            for(var i = 0,  len = result.rows.length; i < len; i++){
                var pl = playlistFromDB(result.rows[i]);
                results.push(pl);
            }
        }
        callback(err, results);
    });
};

/*
exports.getByID = function (id, callback) {
    console.log("User by id function");
    var table = "public.users";
    var where = '"ID" = ' + id;

    db.getQuery(table, where, function (err, result) {
        var currentUser;
        if (!err && result.rows[0]) {
            currentUser = userFromDB(result.rows[0]);
        }
        callback(err, currentUser);
    });
};

function userFromDB(rawUser) {
    console.log("UserFromDB");
    return new User(rawUser.ID, rawUser.Email, rawUser.Name, rawUser.Salt, rawUser.Hash, rawUser.ProfilePic);
}
*/
function playlistFromDB(rawPlaylist){
    return new Playlist(rawPlaylist.ID,
                        rawPlaylist.UserID,
                        rawPlaylist.IsPublic,
                        rawPlaylist.Name,
                        rawPlaylist.Description,
                        rawPlaylist.JsonPlaylist);
}
