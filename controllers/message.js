const Message = require("../model/messages");
const mongoose = require("mongoose");
const User = require("../model/user");


exports.createMessage = async function(req, res, next){
    try {
        let receiverId = mongoose.Types.ObjectId(req.params.receiverId)
        let message =  req.body.message       
        let location = req.body.location; 
        let senderId = mongoose.Types.ObjectId(req.params.userId);
        let user = await User.findById(senderId)
        let receiver = await User.findById(receiverId)
         message = await  Message.create({
            text: message,
            createdBy: user.username,
            location
        })
        user = await user.saveMessage(receiver, message, "send");
        await receiver.saveMessage(user, message, "receive");
        let messages = await user.getMessages(receiver)        
        let filteredUser = await user.filterUserData()
        return res.status(200).json({
            status:200,
            message:{
                messages,
                filteredUser
                }    
            })    
        }
    
     catch (error) {         
        return next(error)
    }     
    
}

//get messages between users and receipient
exports.getMessagesBetweenUsers = async (req, res, next) => {

    try {
        let recipientId = mongoose.Types.ObjectId(req.params.recipientId)
        let recipient = await User.findById(recipientId)
        let senderId = mongoose.Types.ObjectId(req.params.userId);
        let user = await User.findById(senderId)
        let messages = await user.getMessages(recipient)        
        console.log(messages.length);

        return res.status(200).json({
            status:200,
            message:messages,
            })    
        }
    
     catch (error) {         
         
        return next(error)
    }     
    

}