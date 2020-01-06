const Message = require("../model/messages");
const mongoose = require("mongoose")
const User = require("../model/user")
exports.createMessage = async function(req, res, next){
    try {
        let type= ""
        
        let receiverId = mongoose.Types.ObjectId(req.params.receiverId)
        let message =  req.body.message
        console.log(message);
        
        let senderId = mongoose.Types.ObjectId(req.params.userId);
        //create message
        let user = await User.findById(senderId)
        let receiver = await User.findById(receiverId)
         message = await  Message.create({
            text: message,
            createdBy: user.username,
        })
        // save message in senders friends list as type send
        console.log(message);
        
        await user.saveMessage(receiver, message, "send");
        await receiver.saveMessage(user, message, "receive");
        user = await User.findById(senderId)
        let filteredUser = await user.filterUserData()
        return res.status(200).json({
            status:200,
            message:{
                filteredUser,
            }
        })
           
    }
    
    catch (error) {
        return next({
            status:500,
            message:error.message
        })
    }
}