var pg = require('pg');
var db = require('./db');


function Comment(ID, userId, playlistId, date, content) {
    this.ID = ID;
    this.UserID = userId;
    this.PlaylistID = playlistId;
    this.Date = date;
    this.Content = content;
}

var exports = module.exports = {};

exports.createComment = function (userId, playlistId, content) {
    return new Comment(null, userId, playlistId, null, content);
};

exports.save = function (comment, callback) {
    console.log("Comment save function");
    var table = "public.comments";
    var toInsert = ' ("UserID", "PlaylistID", "Content") values ( \'' +
        comment.UserID + '\' , \'' + comment.PlaylistID + '\' , \'' + comment.Content + '\')';

    db.insertQuery(table, toInsert, function (error, result) {
        if (error) {
            console.error("error while adding comment to playlist");
        }
        callback(error, result);
    })
};

exports.getPlaylistComments = function(playlistID, callback){
    console.log("Get comments for playlist", playlistID);
    var select = 'c."ID", c."Date", c."Content", c."UserID", u."Name"';
    var from = 'comments c, users u';
    var where = 'c."UserID" = u."ID" AND c."PlaylistID" = ' + playlistID;
    var endArgs = "";

    db.selectQuery(select, from, where, endArgs, function(error, results){
        callback(error, results);
    });
};

