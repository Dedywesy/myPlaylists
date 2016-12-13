var Likes = require('../models/likes');
var Playlist = require('../models/playlists');


module.exports.getPlaylistLikes = function (req, res) {
    console.log("get playlist likes");
    if (!req.params.id) {
        res.status(500).json({
            "message": "Missing playlist ID in params"
        });
        return;
    }
    function onTrue() {
        Likes.getPlaylistLikes(req.params.id, function (error, result) {
            if (error) {
                console.error("Error while getting playlist likes");
                res.status(500).json({
                    "message": "Error while getting playlist likes"
                });
            } else {
                res.status(200).json(result.rows);
            }
        });
    }

    function onFalse() {
        res.status(500).json({
            "message": "This playlist is private or does not exist"
        });
    }

    Playlist.isAccessible(req.params.id, req.payload._id, function (accessible) {
        if (accessible) {
            return onTrue();
        } else {
            return onFalse();
        }
    })
};

module.exports.getUserLikes = function (req, res) {
    console.log("get User likes function");
    if (!req.payload._id) {
        res.status(401).json({
            "message": "Missing payload in header "
        });
        return;
    }
    Likes.getUserLikes(req.payload._id, function (error, results) {
        if (!error) {
            res.status(200).json(results);
        }
        else {
            res.status(500).json(error);
        }
    })
};

module.exports.likePlaylist = function (req, res) {
    console.log("Like a playlist function");
    if (!req.payload._id || !req.body.playlistID) {
        res.status(401).json({
            "message": "Missing payload or playlist ID"
        });
        return;
    }

    function onTrue() {
        var like = Likes.createLike(req.payload._id, req.body.playlistID);
        Likes.getSpecificLike(req.payload._id, req.body.playlistID, function (error, results) {

            if (error) {
                res.status(500).json(error);
            } else if (results.rows[0]) {
                res.status(500).json({
                    message: "You already like this playlist"
                })
            } else {
                Likes.save(like, function (error, results) {
                    if (error == null) {
                        like.ID = results.rows[0].ID;
                        res.status(200).json(like);
                    } else {
                        res.status(500).json(error);
                    }
                })
            }
        });
    }

    function onFalse() {
        res.status(500).json({
            "message": "This playlist is private or does not exist"
        });
    }

    Playlist.isAccessible(req.body.playlistID, req.payload._id, function (accessible) {
        if (accessible) {
            return onTrue();
        } else {
            return onFalse();
        }
    })
};

module.exports.unlikePlaylist = function (req, res) {
    console.log("Unlike a playlist function");
    if (!req.payload._id) {
        res.status(401).json({
            "message": "Missing payload in header "
        });
        return;
    }

    function onTrue (){
        Likes.delete(req.payload._id, req.params.id, function (err) {
            if (err == null) {
                res.status(200).json({
                    message: "playlist unliked"
                })
            } else {
                res.status(500).json(err);
            }
        })
    }

    function onFalse (){
        res.status(500).json({
            "message": "This playlist is private or does not exist"
        });
    }

    Playlist.isAccessible(req.params.id, req.payload._id, function (accessible) {
        if (accessible) {
            return onTrue();
        } else {
            return onFalse();
        }
    })

};

