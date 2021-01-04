const Models = require('../models')
const mongoose = require('mongoose');
const logger = require('../loaders/logger');

 class UserService {
     /**
      * 
      * @param {Object} currentUserRecord - current user information
      * @param {*} currentUserId  - current user id
      * @param {*} otherUserId   - secondary user information
      */
    constructor(currentUserRecord=null, currentUserId, otherUserId=null){
        this.currentUserId = mongoose.Types.ObjectId(currentUserId)
        this.otherUserId = mongoose.Types.ObjectId(otherUserId)
        this.currentUserRecord = currentUserRecord;
    }


    async editUser(){      
        const updatedUser = await Models.User.findOneAndUpdate({_id:this.currentUserId}, 
            { $set: this.currentUserRecord }, { new: true })
            .select('-email -password')
            .populate('friends', [ '_id' , 'username' , 'userImage'])
        logger('info', `${updatedUser.username} edited his/her profile`)

        return updatedUser;
    
    }

    static async getUserData(userId) {
        let result = await Models.User.findOne({_id: mongoose.Types.ObjectId(userId)})
            .select('-email -password -friends')
         return result;

     }
    
    static async getCurrentUserData(userId) {
        let result = await Models.User.findOne({_id: mongoose.Types.ObjectId(userId)})
            .select('-email -password')
            .populate('friends', [ '_id' , 'username' , 'userImage'])
         return result;

     }

    async addFriend (){
        let currentUser = await Models.User.findByIdAndUpdate(this.currentUserId, {
            $push: {
                friends :this.otherUserId,
                
            }
        }, { new: true }).populate('friends', ['_id', 'username', 'userImage']).select('-email -password')
        let otherUser = await Models.User.findByIdAndUpdate(this.otherUserId, {
            $push: {
                friends: this.currentUserId,
                notifications: {
                    text:  `${currentUser.username} added you as a friend `,
                    
                }
            }
        }, { new: true }).select('_id username socketId userImage')

        const filteredUsers = await Models.User.find().select('_id username userImage')
        logger('info', `${currentUser.username} added ${otherUser.username} `)
        return {currentUser, filteredUsers}
    }   

    async removeFriends(){
        let currentUser = await Models.User.findByIdAndUpdate(this.currentUserId,{
            $pull:{
                friends: this.otherUserId
            }
        },
        {new: true}
        
        ).populate('friends', ['_id', 'username' , 'userImage']).select('-email -password ')
        let otherUser = await Models.User.findByIdAndUpdate(this.otherUserId, {
            $pull: {
                friends: this.currentUserId
            }
        },
            { new: true }

        )

        const filteredUsers = await Models.User.find().select('_id username userImage')
        logger('info', `${currentUser.username} removed ${otherUser.username} `)
        return { currentUser, filteredUsers }



    }

    

}

module.exports = UserService;