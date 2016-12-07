var Comments = require("../models/comments");

module.exports.postComment = function(req, res){
    //TODO check that playlist is public
    console.log("Comment a playlist function");
    if (!req.payload._id) {
        res.status(401).json({
            "message": "Missing payload in header "
        });
        return;
    }
    if(req.body.playlistID == parseInt(req.body.playlistID, 10)){
        res.status(401).json({
            "message": "PlaylistID is not an integer"
        });
        return;
    }
    var comment = Comments.createComment(req.payload._id, req.body.playlistID, req.body.comment);
    Comments.save(comment, function(error, result){
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
};

module.exports.getPlaylistComments = function(req, res){ //TODO playlist public?
    if(!req.params.id){
        res.status(500).json({
            "message": "Missing playlistID"
        });
        return;
    }
    Comments.getPlaylistComments(req.params.id, function(error, results){
        if(error){
            res.status(500).json(error);
        }
        else
        {
            var toSend = [];
            for (var i = 0; i < results.rows.length ; i++ ){
                toSend.push(results.rows[i]);
            }
            res.status(200).json(toSend);
        }
    })
};
