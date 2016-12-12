/*Save user profile pictures on a cloud*/
var cloudinary = require('cloudinary');

cloudinary.config({ //TODO get out of the code
    cloud_name: 'dxifcsvkt',
    api_key: '199998563936565',
    api_secret: 'B00dR_0a66oyrRZzin0yn00hF7Q'
});


module.exports.saveImage = function (source, callback) {
    cloudinary.uploader.upload(source, function(result) {
        if(!result.secure_url){ //error while uploading
            callback(null);
        }
        else { //everything went fine
            callback(result.secure_url);
        }
    });
}
