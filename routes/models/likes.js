var pg = require('pg');
var db = require('./db');


function Like(ID, userId, playlistId) {
    this.ID = ID;
    this.userId = userId;
    this.playlistId = playlistId;
}

var exports = module.exports = {};

exports.createLike = function (userId, playlistId) {
    return new Like(null, userId, playlistId);
};

exports.save = function (like, callback) {
    console.log("Like save function");
    var table = "public.likes";
    var toInsert = ' ("UserID", "PlaylistID") values ( \'' +
        like.userId + '\' , \'' + like.playlistId + '\')';

    db.insertQuery(table, toInsert, function (err, result) {
        if (err) {
            console.error("error while adding like to playlist", err);
        }
        callback(err, result);
    })
};

exports.delete = function (UserID, playlistID, callback) {
    console.log("like delete function");
    var table = "public.likes";
    var where = '"UserID"=' + userID + 'AND "PlaylistID"= ' + playlistID;
    db.deleteQuery(table, where, function (err, result) {
        if (err) {
            console.error("Error while deleting like : ", likeID);
        }
        callback(err, result);
    })
};

exports.getUserLikes = function (userID, callback) {
    console.log('Get all user likes function');
    var table = "public.likes";
    var where = '"UserID" = ' + "'" + userID + "'";
    var results = [];

    db.getQuery(table, where, function (err, result) {
        if (!err && result.rows[0]) {
            for (var i = 0, len = result.rows.length; i < len; i++) {
                var pl = likeFromDB(result.rows[i]);
                results.push(pl);
            }
        }
        callback(err, results);
    });
};

exports.getPlaylistLikes = function (playlistID, callback) {
    console.log('Get playlists likes function');
    var select = "Count(*)";
    var table = "public.likes";
    var where = '"PlaylistID" = ' + playlistID;
    var endArgs = "";

    db.selectQuery(select, table, where, endArgs, function (err, result) {
        callback(err, result);
    });
};

exports.getByID = function (id, callback) {
    console.log("Like by id function");
    var table = "public.likes";
    var where = '"ID" = ' + id;
    db.getQuery(table, where, function (err, result) {
        var playlist;
        if (!err && result.rows[0]) {
            playlist = likeFromDB(result.rows[0]);
        }
        callback(err, playlist);
    });
};

exports.getSpecificLike = function (userId, playlistId, callback) {
    console.log("Specific like function");
    var table = "public.likes";
    var where = '"UserID" = ' + userId + ' AND "PlaylistID" = ' + playlistId;
    db.getQuery(table, where, function (err, result) {
        callback(err, result);
    });
};

function likeFromDB(rawLike) {
    return new Like(rawLike.ID,
        rawLike.UserID,
        rawLike.PlaylistID);
}

