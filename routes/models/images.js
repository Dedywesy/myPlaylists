/*Save user profile pictures on a cloud*/
var cloudinary = require('cloudinary');

cloudinary.config({
    cloud_name: 'dxifcsvkt',
    api_key: '199998563936565',
    api_secret: process.env.CLOUD_SECRET
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
};
