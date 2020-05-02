const cloudinary = require ('cloudinary');
const config = require('../config');

exports.cloudinaryConfig = function (req, res, next) {
    cloudinary.v2.config({
        cloud_name: config.cloudinary.cloudName,
        api_key: config.cloudinary.apiKey,
        api_secret: config.cloudinary.apiSecret,
        });
    next();
}

