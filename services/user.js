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
        await Models.User.findOneAndUpdate({_id:this.currentUserId}, 
            {$set:this.currentUserRecord})
        const updatedUser = await Models.User.findById(this.currentUserId);      
        const currentUser = await updatedUser.filterUserData();
        logger('info', `${this.currentUserRecord.username} edited his/her profile`)

        return currentUser;
    
    }

    async addFriend (){
        let currentUser = await Models.User.findById(this.currentUserId);
        const otherUser = await Models.User.findById(this.otherUserId);
        let filteredOtherUserData = await otherUser.filterUserData();
        await currentUser.addFriend(filteredOtherUserData);
        await otherUser.addFriend(this.currentUserRecord);
        await currentUser.removeFriendRequest(otherUser);
        const users = await Models.User.find();
        currentUser = await Models.User.findById(this.currentUserId);
        currentUser = await currentUser.filterUserData();
        const filteredUsers =  await Models.User.filterData(users);
        logger('info', `${currentUser.username} added ${otherUser.username} `)
        return {currentUser, filteredUsers}
    }   

    async rejectFriendRequest (){
        let currentUser = await Models.User.findById(this.currentUserId)
        const otherUser = await Models.User.findById(this.otherUserId)
        await currentUser.removeFriendRequest(otherUser)
        const users = await Models.User.find()
        currentUser = await Models.User.findById(this.currentUserId)
        currentUser = await currentUser.filterUserData()
        const filteredUsers =  await Models.User.filterData(users)
        return {currentUser, filteredUsers}
    }   
    
    async sendFriendRequest(){
        let currentUser = await Models.User.findById(this.currentUserId);
        let otherUser = await Models.User.findById(this.otherUserId);
        let filteredOtherUserData = await otherUser.filterUserData();
        currentUser.requestsSent.push({
            sentTo: filteredOtherUserData.username,
            status:'pending'
        })
        currentUser = await currentUser.save();
        currentUser = await currentUser.filterUserData()
        logger('info', `${currentUser.username} sent ${otherUser.username} a friend request`)
        await otherUser.sendFriendRequest(this.currentUserRecord);
        otherUser = await Models.User.findById(this.otherUserId);
        filteredOtherUserData = await otherUser.filterUserData();
        return {currentUser, filteredOtherUserData}
    }

}

module.exports = UserService;