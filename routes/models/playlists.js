var pg = require('pg');
var db = require('./db');
var likes = require('./likes');
var format = require('pg-format');


function Playlist(ID, userId, isPublic, name, description, jsonPlaylist) {
    this.ID = ID;
    this.UserID = userId;
    console.log(isPublic);
    if (isPublic == true) { //Toforce isPublic to be a boolean
        this.IsPublic = true;
    } else {
        this.IsPublic = false;
    }
    this.Name = name;
    this.Description = description;
    this.JsonPlaylist = jsonPlaylist;
}

var exports = module.exports = {};

exports.createPlaylist = function (userId, isPublic, name, description) {
    //New playlist is public
    return new Playlist(null, userId, isPublic, name, description, '{"songs":[]}');
};

exports.save = function (playlist, callback) {
    console.log("playlist save function");
    var table = "public.playlists";
    var toInsert = format(' ("UserID", "IsPublic", "Name", "Description", "JsonPlaylist") values ' +
        '(%L,' + playlist.IsPublic + ', %L, %L, %L)', playlist.UserID, playlist.Name, playlist.Description, playlist.JsonPlaylist);
    console.log(toInsert);

    db.insertQuery(table, toInsert, function (err, result) {
        if (err) {
            console.error("error while adding playlist to db", err);
        }
        callback(err, result);
    })
};

exports.update = function (playlist, callback) {
    console.log('playlist update function');
    var table = "public.playlists";
    var setArgs = format('("Name", "Description", "IsPublic", "JsonPlaylist") = ( %L, %L, ' + playlist.IsPublic + ', %L)',
        playlist.Name, playlist.Description, playlist.JsonPlaylist);
    var where = format('"ID"=%L', playlist.ID);
    db.updateQuery(table, setArgs, where, function (err, result) {
        if (err) {
            console.error("Error while updating playlist table");
        }
        callback(err, result);
    })
};

exports.delete = function (playlistID, callback) {
    console.log("playlist delete function");
    var table = "public.playlists";
    var where = format('"ID"=%L', playlistID);
    db.deleteQuery(table, where, function (err, result) {
        if (err) {
            console.error("Error while deleting playlist : ", playlistID);
        }
        callback(err, result);
    })
};

exports.getAllPlaylists = function (userID, callback) {
    console.log('Get all playlists function');
    var table = "public.playlists";
    var where = format('"UserID" = %L', userID);
    var results = [];
    var counter = 0;

    db.getQuery(table, where, function (err, result) {
        if (!err && result.rows[0]) {
            result.rows.forEach(function (pl, index) {
                likes.getPlaylistLikes(pl.ID, function (error, res) {
                    if (!err && res.rows[0]) {
                        pl.likeCount = res.rows[0].count;
                    } else {
                        pl.likeCount = 0;
                    }
                    results.push(pl);
                    counter++;
                    if (counter == result.rows.length) {
                        callback(err, results);
                    }
                });
            });
        }
    });
};

exports.getPublicPlaylists = function (userID, callback) {
    /*console.log('Get public playlists function');
     var table = "public.playlists";
     var where = '"UserID" = ' + "'" + userID + "' AND IsPublic is true";
     var results = [];

     db.getQuery(table, where, function (err, result) {
     if (!err && result.rows[0]) {
     for (var i = 0, len = result.rows.length; i < len; i++) {
     var pl = playlistFromDB(result.rows[i]);
     results.push(pl);
     }
     }
     callback(err, results);
     });*/
};

exports.getByID = function (id, callback) {
    console.log("Playlist by id function");
    var table = "public.playlists";
    var where = format('"ID" = %L', id);
    console.log(where);
    db.getQuery(table, where, function (err, result) {
        var playlist;
        if (!err && result.rows[0]) {
            playlist = result.rows[0];
        }
        callback(err, playlist);
    });
};

exports.getTopPlaylists = function (callback) {
    var select = 'count(p."ID") likeCount, p."ID" PlaylistID, p."Name" PlaylistName, p."Description"' +
        ' PlaylistDescription, p."JsonPlaylist" PlaylistPlaylist, u."Name" UserName, u."ID" UserID'
    var from = 'public.playlists p, public.users u, public.likes l';
    var where = 'p."UserID" = u."ID" AND p."ID" = l."PlaylistID" AND p."IsPublic" = true';
    var endArgs = 'GROUP BY p."ID", u."Name", U."ID" ORDER BY likeCount DESC LIMIT 10';

    db.selectQuery(select, from, where, endArgs, function (error, result) {
        callback(error, result.rows);
    })
};
