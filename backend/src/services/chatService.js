const Logger = require("../loaders/logger");
const models = require('../models')
const services = require('./index')
const mongoose = require("mongoose");

const connectedUsers = {};

class ChatServer{

    generateChatId(sentUserId, currentUserId) {
        const keyArray = []
        keyArray.push(sentUserId)
        keyArray.push(currentUserId)
        keyArray.sort((a, b) => a - b)
        return keyArray.join('_')
    }

    static async setUserSocket(socket, io){
        socket.on('set-socket', async function(data){
            socket.userId = data.userId
            connectedUsers[data.userId] = socket
            await models.UserModel.findOneAndUpdate({
                _id: mongoose.Types.ObjectId(data.userId)
                },
                {
                    $set:{
                        socketId: socket.id,
                    },
                }
            )
            const users = await services.UsersService.getAllUsers()
            io.emit('users', {
                action: 'updatedUsers',
                payload: users
            })

            Logger.silly(`${data.userId} has set socket id`)
            Logger.silly(`Users updated`)

        })
    }

    static async messageListener(socket, io){
        socket.on('private', async function (data) {
            try {
                 const currentUserId = data.from
                 const recipientId = data.to
                 const message = data.message

                 const MessageServiceInstance = new services.MessageService(
                     currentUserId,
                     recipientId,
                     message,
                 )
                 await MessageServiceInstance.createMessage();
                 const messages = await MessageServiceInstance.getMessagesBetweenUsers()

                 if (connectedUsers.hasOwnProperty(data.to)) {
                     connectedUsers[data.to].emit('private_chat', {
                         messages,
                         from: data.from
                     })

                     connectedUsers[data.to].emit('messages', {
                         messages,
                         from: data.from
                     })
                 }
                 io.to(socket.id).emit('private_chat', {
                     messages
                 })
            } catch (error) {
                console.log(error)
            }
           
        })
    }

    static async  disconnect(socket, io){
        let now = new Date();
        let user = await models.UserModel.findOne({
            socketId: socket.id
        })
        
        if (user) {
            user.lastOnline = now;
            user.socketId = null;
            await user.save();
        }
        const users = await services.UsersService.getAllUsers()
        io.emit('users', {
            action: 'updatedUsers',
            payload: users
        })
        Logger.silly(`Users updated`)
        Logger.info("Client disconnected")
    }
}

module.exports = ChatServer;