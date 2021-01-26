const express = require('express')
const route = express.Router({mergeParams: true});
const services = require('../../services')
const multer = require('multer');
const cloudinaryStorage = require('multer-storage-cloudinary');
const cloudinary = require ('cloudinary');

const storage = cloudinaryStorage({
	cloudinary: cloudinary,
    folder: 'simplychat',
	filename: function (req, file, cb) {
		cb(undefined, `${file.originalname.split('.')[0]}`);
	}
});

const upload = multer({
    storage,
    limits: {
        fieldSize: 1024 * 1024 * 5
    }
})

const uploadMiddleware = upload.fields([{ name: 'image', maxCount: 1 }, { name: 'info', maxCount: 3 }])

route.post('/send-message/:receiverId', uploadMiddleware, async function(req, res, next){
    try {
        let userData;
        let image = null;
        if(req.files === undefined){
            userData = req.body
        }else{
            image = req.files.image[0].secure_url
            userData = JSON.parse(req.body.info)
        }
        const MessageService = new services.MessageService(
            req.params.userId,
            req.params.receiverId,
            userData.message,
            image,
            userData.chatId

        )
        const {currentUser} = await MessageService.createMessage();
        return res.status(200).json({
            status:200,
            message:{
                currentUser
                }    
            })    
        }
    
     catch (error) {                  
        return next(error)
        }
    }    
)
route.get('/messages/:recipientId', async (req, res, next) => {

    try {
        const MessageService = new services.MessageService(
            req.params.userId,
            req.params.recipientId,
        )
        const messages = await MessageService.getMessagesBetweenUsers() ;    
        return res.status(200).json({
            status:200,
            message:messages,
            })    
        }
    
    catch (error) {                  
        return next(error)
    }     
})
module.exports = route;