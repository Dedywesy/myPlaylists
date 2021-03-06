var YouTube = require('youtube-node');

var youTube = new YouTube();
var key = process.env.YT_KEY;
youTube.setKey(key);


module.exports.search = function (req, res) {
    if (!req.params.search) {
        res.status(401).json({
            "message": "Missing research params"
        });
        return;
    }
    youTube.addParam('type', 'video');
    youTube.search(req.params.search, 5, function (error, result) {
        if (error) {
            console.error(error);
            res.status(500).json(error);
        }
        else {
            res.status(200).json(result);
        }
    });
};