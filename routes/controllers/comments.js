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

module.exports.getPlaylistComments = function(req, res){ //playlist public?
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

/*

 module.exports.getPlaylistLikes = function (playlistID, callback) {
 Likes.getPlaylistLikes(playlistID, callback(error, result));
 };

 module.exports.getUserLikes = function(req, res){
 console.log("get User likes function");
 if (!req.payload._id) {
 res.status(401).json({
 "message": "Missing payload in header "
 });
 return;
 }
 Likes.getUserLikes(req.payload._id, function(error, results){
 if(!error){
 res.status(200).json(results);
 }
 else{
 res.status(500).json(error);
 }
 })
 };

 module.exports.likePlaylist = function(req, res){
 console.log("Like a playlist function");
 if (!req.payload._id) {
 res.status(401).json({
 "message": "Missing payload in header "
 });
 return;
 }
 var like = Likes.createLike(req.payload._id, req.body.playlistID);
 Likes.getSpecificLike(req.payload._id, req.body.playlistID, function (error, results){
 if(error){
 res.status(500).json(error);
 } else if (results.rows[0]){
 res.status(500).json({
 message : "You already like this playlist"
 })
 }else{
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
 };

 module.exports.unlikePlaylist = function (req, res){
 console.log("Unlike a playlist function");
 if (!req.payload._id) {
 res.status(401).json({
 "message": "Missing payload in header "
 });
 return;
 }
 Likes.delete(req.payload._id, req.params.id, function (err, res) {
 if(err == null){
 res.status(200).json({
 message : "playlist unliked"
 })
 } else{
 res.status(500).json(err);
 }
 })
 };


 */