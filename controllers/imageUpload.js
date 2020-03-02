const util = require('util');
const  DataUri = require('datauri');
const dataUri = new DataUri();
const path = require('path');
const cloudinary = require ('cloudinary');
const {cloudinaryConfig} = require("../utils/cloudinaryConfig")

/**
 *
 * @param { File } object file object that will be uploaded
 * @description - This function does the following
 * - It uploads a file to the image bucket on Google Cloud
 * - It accepts an object as an argument with the
 *   "originalname" and "buffer" as keys
 */


const uploadImage = (file) => new Promise((resolve, reject) => {
  const { originalname, buffer } = file
  const dUri =dataUri.format(path.extname(originalname).toString(), buffer);
  let imageFile = dUri.content;
  return cloudinary.v2.uploader.upload(imageFile).then((result) => {
    const image = result.url;
    return resolve(image)
  }).catch(error)
})

module.exports = uploadImage;