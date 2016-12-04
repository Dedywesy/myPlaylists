var Playlists = require('../models/playlists');

function hasRightsOnPlaylist(userID, playlistID, onSucess, onError) {
    Playlists.getByID(playlistID, function (err, playlist) {
        if (err) {
            return onError();
        }
        else {
            if (userID == playlist.userId) {
                return onSucess();
            }
            return onError();
        }
    })
}

module.exports.getPlaylist = function (req, res) {
    console.log("get playlist function");
    if (!req.payload._id || !req.params.id) {
        res.status(401).json({
            "message": "Missing payload in header or PlaylistID in params"
        });
        return;
    }
    Playlists.getByID(req.params.id, function (error, result) {
        if (error == null && result != undefined) {
            //check if belongs to user or public
            if((result.UserID == req.payload._id) || result.isPublic){
                res.status(200).json(result);
            } else{
                res.status(401).json({
                    "message": "You don't have the rights to view this playlist"
                })
            }
        } else {
            res.status(500).json({
                "message": "This playlist does not exist"
            });
        }
    })
};

module.exports.getUserPlaylists = function (req, res) {
    console.log("get User playlists function");
    if (!req.payload._id || !req.params.id) {
        res.status(401).json({
            "message": "Missing payload in header or userID in params"
        });
        return;
    }

    var onDbResult = function (error, results) {
        if (!error) {
            res.status(200).json(results);
        } else {
            res.status(500).json(error)
            ;
        }
    };
    var id;
    //Get your own playlists
    if (req.payload._id == req.params.id) {
        id = req.payload._id;
        Playlists.getAllPlaylists(id, onDbResult);
    }
    else {
        id = req.params.id;
        Playlists.getPublicPlaylists(id, onDbResult); //TOdo implement
    }
};

module.exports.createPlaylist = function (req, res) {
    console.log("create playlists function");
    var newPlaylist = Playlists.createPlaylist(req.payload._id,
        req.body.playlist.isPublic,
        req.body.playlist.name,
        req.body.playlist.description);
    Playlists.save(newPlaylist, function (error, result) {
        if (error == null) {
            newPlaylist.ID = result.rows[0].ID;
            res.status(200).json(newPlaylist);
        } else {
            res.status(500).json(error);
        }
    })
};

module.exports.editPlaylist = function (req, res) {
    console.log("Edit playlists function");
    hasRightsOnPlaylist(req.payload._id, req.body.playlist.ID,
        function () {
            var newPlaylist = Playlists.createPlaylist(req.payload._id,
                req.body.playlist.isPublic,
                req.body.playlist.name,
                req.body.playlist.description);
            newPlaylist.jsonPlaylist = req.body.playlist.jsonPlaylist;
            newPlaylist.ID = req.body.playlist.ID;

            Playlists.update(newPlaylist, function (error, result) {
                if (error == null) {
                    newPlaylist.ID = result.rows[0].ID;
                    res.status(200).json(newPlaylist);
                } else {
                    res.status(500).json(error);
                }
            })
        }, function () {
            res.status(401).json({
                "message": "You don't have the rights to edit this playlist"
            })
        });
};

module.exports.deletePlaylist = function (req, res) {
    console.log("Delete playlist function");
    console.log(req.params.id);
    if (!req.payload._id || !req.params.id) {
        res.status(401).json({
            "message": "Missing payload in header or playlist ID in params"
        });
        return;
    }
    hasRightsOnPlaylist(req.payload._id, req.params.id,
        function () {
            console.log("lol");
            Playlists.delete(req.params.id, function (error, result) {
                if (error == null) {
                    res.status(200).json("Deleted");
                } else {
                    res.status(500).json(error);
                }
            })
        }, function () {
            res.status(401).json({
                "message": "You don't have the rights to delete this playlist"
            })
        });
};