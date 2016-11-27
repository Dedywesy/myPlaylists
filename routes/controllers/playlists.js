var Playlists = require('../models/playlists');

module.exports.getPlaylists = function (req, res) {
    console.log("get playlists function");
    if (!req.payload._id || !req.headers.touserid) {
        res.status(401).json({
            "message": "Missing payload or touserid in header"
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

    //Get your own playlists
    if (req.payload._id == req.headers.touserid) {
        var id = req.payload._id;
        Playlists.getAllPlaylists(id, onDbResult);
    }
    else {
        var id = req.header.touserid;
        Playlists.getPublicPlaylists(id, onDbResult);
    }
};

module.exports.createPlaylists = function (req, res) {
    console.log("create playlists function");
    console.log(req.payload._id);
    console.log(req.body);
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
