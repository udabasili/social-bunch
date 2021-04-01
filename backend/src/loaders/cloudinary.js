const cloudinary = require ('cloudinary');
const config = require('../config');

exports.cloudinaryConfig = function (req, res, next) {
    cloudinary.v2.config({
        cloud_name: config.cloudinary.CLOUDINARY_CLOUD_NAME,
        api_key: config.cloudinary.CLOUDINARY_API_KEY,
        api_secret: config.cloudinary.CLOUDINARY_API_SECRET
        })
    next();
}

