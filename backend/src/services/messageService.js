const Logger = require('../loaders/Logger');
const models = require('../models');
const mongoose = require('mongoose');

class MessageService {
    /**
     * 
     * @param {String} userId - the id of the current user
     * @param {String} recipientId the id of the current user
     * @param {*} message the message being set
     */
    constructor(userId, recipientId = null, message = null) {
        this.senderId = mongoose.Types.ObjectId(userId)
        this.recipientId = mongoose.Types.ObjectId(recipientId)
        this.chatId = this.generateChatId(userId, recipientId)
        this.message = message;
    }

    /**
     * store the message sent between users
     * @returns {Array} messages
     */
    async createMessage() {
        let currentUser = await models.UserModel.findById(this.senderId)
        const receiver = await models.UserModel.findById(this.recipientId)
        await models.MessagesModel.create({
            text: this.message.text,
            createdBy: this.senderId,
            chatId: this.chatId
        })
        Logger.info(`${currentUser.username} send message to ${receiver.username}`)
        return currentUser
    }

    async getCurrentUserMessages() {
        const messages = await models.MessagesModel.find({
            chatId: {
                $regex: this.senderId,
                $options: 'i'
            },
            createdBy: {
                $ne: this.senderId
            }
        })
        Logger.silly(`Current user got his message`)
        return messages
    }

    async setReadMessages() {
        const filter = {
            chatId: this.chatId
        }

        const update = {
            $set: {
                read: true
            }
        }
        await models.MessagesModel.updateMany(filter, update)
        const messages = await this.getCurrentUserMessages()
        Logger.silly(`Current user got his message`)
        return messages
    }

    generateChatId(sentUserId, currentUserId) {
        const keyArray = []
        keyArray.push(sentUserId)
        keyArray.push(currentUserId)
        keyArray.sort()
        return keyArray.join('_')
    }

    /**
     * get all the messages between two users
     * @returns {Array} messages
     */
    async getMessagesBetweenUsers() {
        const messages = await models.MessagesModel.find({
            chatId: this.chatId
        })
        return messages;
    }
}

module.exports = MessageService;