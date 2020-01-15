const util = require('util')
const Cloud = require('@google-cloud/storage')
const path = require('path')
let serviceKey;

if (process.env.NODE_ENV === "production"){
  serviceKey = process.env.CREDS
  serviceKey = JSON.parse(serviceKey)
}
else{
  serviceKey = path.join(__dirname, '../utils/simply-chart-b0f4e69d71d8.json')

}

const { Storage } = Cloud


const gc = new Storage({
  keyFilename: serviceKey ,
  projectId: 'simply-chart',
})

const bucket = gc.bucket("simply-chart")
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
  const blob = bucket.file(originalname.replace(/ /g, "_"))

  const blobStream = blob.createWriteStream({
    resumable: false
  })
 
  blobStream.on('finish', () => {
      
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`
    
    
    resolve(publicUrl)
  })
  .on('error', (error) => {
      console.log(error);
      
    reject(`Unable to upload image, something went wrong`)
  })
  .end(buffer)
})

module.exports = uploadImage;