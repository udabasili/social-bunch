const logger = require('../loaders/logger');
const Models = require('../models');
const mongoose = require('mongoose');

class MessageService {
    /**
     * 
     * @param {String} userId - the id of the current user
     * @param {String} recipientId the id of the current user
     * @param {*} message the message being set
     * @param {*} location the optional location value of the current user
     */
    constructor(userId, recipientId, message=null, location=null) {
        this.senderId = mongoose.Types.ObjectId(userId)
        this.recipientId = mongoose.Types.ObjectId(recipientId)
        this.message = message;
        this.location = location;
    }
    
    /**
     * store the message sent between users
     * @returns {Array} messages
     */
    async createMessage(){
        let currentUser = await Models.User.findById(this.senderId)
        const receiver = await Models.User.findById(this.recipientId)
        const message = await  Models.Message.create({
            text: this.message ,
            createdBy: currentUser.username,
            location: this.location
         })
        const userRecord = await currentUser.saveMessage(receiver, message, 'send');
        await receiver.saveMessage(currentUser, message, 'receive');
        currentUser = await userRecord.filterUserData()
        const messages = await userRecord.getMessages(receiver);    
        logger('info', `${currentUser.username} send message to ${receiver.username}`)  
        return {messages, currentUser}
    }

    /**
     * get all the messages between two users
     * @returns {Array} messages
     */
    async getMessagesBetweenUsers(){
        const recipient = await Models.User.findById(this.recipientId);
        const user = await Models.User.findById(this.senderId);
        const messages = await user.getMessages(recipient);    
        return messages;   
    }   
}

module.exports = MessageService;