var http = require('http');

var client_id = 'b23455855ab96a4556cbd0a98397ae8c';

module.exports.search = function (req, res) {
    var query = req.params.search.replace(/ /g, "+");
    var path = '/tracks/?q='+query+'&client_id='+client_id;
    console.log(path);
    return http.get({
        host: 'api.soundcloud.com',
        path: path
    }, function(response) {
        // Continuously update stream with data
        var body = '';
        response.on('data', function(d) {
            body += d;
        });
        response.on('end', function() {
            res.status(200).json(body);
            return;
        });
        response.on('error', function(error){
            res.status(500).json(error);
            return;
        })
    });
};

module.exports.getTrack = function (req, res) {
    var path = '/tracks/' + req.params.songId + '.json?client_id=' + client_id;
    console.log(path);
    return http.get({
        host: 'api.soundcloud.com',
        path: path
    }, function(response) {
        // Continuously update stream with data
        var body = '';
        response.on('data', function(d) {
            body += d;
        });
        response.on('end', function() {
            res.status(200).json(body);
            return;
        });
        response.on('error', function(error){
            res.status(500).json(error);
            return;
        })
    });
}