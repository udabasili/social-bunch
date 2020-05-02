const dotenv = require('dotenv');
dotenv.config();
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

module.exports = {
  port: process.env.PORT || 8081,
  mongoDBProduction: process.env.MONGODB_URI,
  mongoDBDevelopment: process.env.MONGODB_URI_DEVELOPMENT,
  jwtSecret: process.env.JWT_SECRET,
  secretKey: process.env.SECRET_KEY,
  googleApi: process.env.GOOGLE_API,
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  cloudinary:{
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET
  },
};
