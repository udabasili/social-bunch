const express = require('express')
const route = express.Router({mergeParams: true});
const services = require('../../services')

route.post('/send-message/:receiverId', async function(req, res, next){
    try {
        const MessageService = new services.MessageService(
            req.params.userId,
            req.params.receiverId,
            req.body.message,
            req.body.location
        )
        const {messages, currentUser} = await MessageService.createMessage();
        return res.status(200).json({
            status:200,
            message:{
                messages,
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