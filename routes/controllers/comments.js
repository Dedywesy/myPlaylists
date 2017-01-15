var Comments = require("../models/comments");
var Playlist = require("../models/playlists");

module.exports.postComment = function (req, res) {
    console.log("Comment a playlist function");
    if (!req.payload._id || !req.body.playlistID || !req.body.comment) {
        res.status(400).json({
            "message": "Missing payload, playlistID or comment"
        });
        return;
    }

    function onTrue() {
        var comment = Comments.createComment(req.payload._id, req.body.playlistID, req.body.comment);
        Comments.save(comment, function (error, result) {
            console.log(error);
            if (error == null) {
                console.log(result.rows[0]);
                comment.ID = result.rows[0].ID;
                comment.Date = result.rows[0].Date;
                res.status(200).json(comment);
            } else {

                res.status(500).json(error);
            }
        })
    }

    function onFalse() {
        res.status(401).json({
            "message": "This playlist is private or does not exist"
        });
    }

    Playlist.isAccessible(req.body.playlistID, req.payload._id, function (accessible) {
        if(accessible){
            return onTrue();
        } else {
            return onFalse();
        }
    });
};

module.exports.getPlaylistComments = function (req, res) {
    if (!req.params.id || !req.payload._id) {
        res.status(400).json({
            "message": "Missing payload or playlistID"
        });
        return;
    }

    function onTrue() {
        Comments.getPlaylistComments(req.params.id, function (error, results) {
            if (error) {
                res.status(500).json(error);
            }
            else {
                var toSend = [];
                for (var i = 0; i < results.rows.length; i++) {
                    toSend.push(results.rows[i]);
                }
                res.status(200).json(toSend);
            }
        })
    }

    function onFalse() {
        res.status(401).json({
            "message": "This playlist is private or does not exist"
        });
    }

    Playlist.isAccessible(req.params.id, req.payload._id, function (accessible) {
        if(accessible){
            return onTrue();
        } else {
            return onFalse();
        }
    });
};
