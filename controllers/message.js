const Message = require("../model/messages");
const User = require("../model/user")
exports.createMessage = async function(req, res, next){
    try {
        let receiverUser = req.body.username
        let message =  req.body.message
        let senderUser = req.params.userId
        let message = await  Message.create({
            message: message,
            createdBy: senderUser,
            sentTo: receiverUser
        })
        //check if user exists
        let findReceiverUser = await User.findOne({username: receiverUser })
        if(findReceiverUser){
            //If user exists, go through his friend list to confirm the sender is a freind
            let friendCheckIndex = findReceiverUser.friends.findIndex(friend => {
                friend.userInfo._id.toString() === senderUser.toString()
            });
            if(friendCheckIndex){
                findReceiverUser.friends[friendCheckIndex].messages.push(message)
                findReceiverUser.save()
                return res.status(200).json({
                    status:200,
                    message:"successfully"
                })
            }
        }
        else{
            return next({
            status:500,
            message:error.message
        })
        }
    } catch (error) {
        
    }
}