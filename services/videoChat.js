const Models = require('../models')


class VideoService {
    static async makeCall(name, target){
        let caller = await Models.User.findOne({
            username: name
        }).select("username userImage socketId _id ")
        let receiver = await Models.User.findOne({
            username : target
        }).select("username userImage socketId _id ")     
        return {caller, receiver}

    }

     static async endCall(username){
        let user = await Models.User.findOne({
            username
        })      
        let socketId  = user.socketId

    }
}

module.exports = VideoService