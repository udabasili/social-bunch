const loggerFunction = require('./logger')
const services = require('../services');
const { User } = require('../models');
const sockets = {};

/**
 * switch on socket channel for setting values for room model
 * @param {*} socket 
 */
function setRoomEvent(socket) {
    socket.on('setRooms', async () => { 
        try {
            const result = await services.ChatService.setRooms()
            loggerFunction('info', result)
        } catch (error) {
            return next(error)

        }
        
    })
}

/**
 * update registered users and online users
 * @param {*} socket 
 */
function getAllOnlineUsersEvent(socket, io) {
    socket.on('getOnlineUsers', async ()=>{  
        try {
            const { users, onlineUsers } = await services.ChatService.getOnlineUsers()
            io.emit('onlineUsers', {
                users,
                usersStatus: onlineUsers
                }
            )
        } catch (error) {
            return next(error)

        }
        
         ;
    })
}

/**
 * listener to set current users socket id
 * @param {*} socket 
 */
function setUserSocketIdEvent(socket, io){
    socket.on('login',async ({username},callback) => {   
        try {
            await services.ChatService.setUserSocketId(username, socket.id)
            io.emit('changeOnlineUsers')
        } catch (error) {
            return next(error)

        }
        
    })
}

/**
 * create a new oom when user creates a new group on client end
 * @param {*} socket 
 */
function createRoomEvent(socket){
    socket.on('create', async ({roomName}, callback) =>{
        try {
            await services.ChatService.createRoom(roomName)

        } catch (error) {
            return next(error)

        }
        }
    )
}

/**
 * update the list of online users in a room when a user enters room
 * @param {Object} socket 
 * @param {Object} io 
 */
function enterRoomEvent(socket, io){
    socket.on('enter', async ({username, roomId}) =>{    
        try {
            const room = await services.ChatService.joinRoom(username, socket.id, roomId)
            socket.join(room[0].name)
            io.to(room[0].name).emit('updateRoomMemberStatus', room[0])
            socket.to(room).emit('updateRoomMemberStatus', room)   

        } catch (error) {
            return next(error)

        } 
                    
              
    })
}

/**
 * update the list of online users in a room when a user exits room
 * @param {Object} socket 
 * @param {Object} io 
 */
function exitRoomEvent(socket){
    socket.on('exit', async ({username, roomId}) =>{     
        try {
            const room = await services.ChatService.leaveRoom(username, roomId)
            socket.leave(room[0].name)
            socket.to(room[0].name).emit('updateRoomMemberStatus', room[0])   

        } catch (error) {
            return next(error)

        } 
                    
    })
}

/**
 * handle messages between users
 * @param {Object} socket 
 * @param {Object} io 
 */
function privateMessageEvent(socket, io){
    socket.on('messageUser', async ({ message, receiver, sender, location, chatId}, callback) =>{
        let date = new Date();
            // const { userSender, socketId } = await services.ChatService.getUserSocketId(receiver, sender)
        const MessageService = new services.MessageService(sender, receiver)
            const messages = await MessageService.getMessagesBetweenUsers();
            io.emit('privateMessage', {
                messages,
                receiver,
                sender
            })
            // const { userSender, socketId } = await services.ChatService.getUserSocketId(receiver, sender)
            // io.emit('privateMessage', {
            //     text: message,
            //     createdAt: date.toISOString(),
            //     createdBy: sender,
            //     senderProfile: userSender,
            //     sentTo: receiver,
            //     location
            // })

        
        }
    )
}

/**
 * handle messages within group
 * @param {Object} socket 
 * @param {Object} io 
 */
function groupMessageEvent(socket, io){
    socket.on('messageToGroup', async ({message,senderId, groupId}) =>{ 
        try {
            let date = new Date();
            const { room, username } = await services.ChatService.getRoomInfo(senderId, groupId)
            io.in(room.name).emit('groupMessage', {
                text: message,
                createdAt: date.toISOString(),
                groupName: room,
                createdBy: username,
            })

        } catch (error) {
            return next(error)

        } 
        
    })       
}

/**
 * get online friends of current user
 * @param {Object} socket 
 * @param {Object} io 
 */
function currentUserOnlineFiendsEvent(socket){
    socket.on('getOnlineFriends', async (username, callback)=>{
        try {
            const onlineFriends = await services.ChatService.currentUserOnlineFriends(
                senderId,
                groupId
            )
            callback(onlineFriends)
        } catch (error) {
            return next(error)

        } 
       
    })
}

function setAllUser(socket,io){
    socket.on('allUsers', async() =>{
        try {
            const allUsers = await services.ChatService.getAllUsers()
            console.log(allUsers.length)
            io.emit('setAllUsers', {
                allUsers
            })
        } catch (error) {
            return next(error)

        } 
        
    })
}


function newUserAdded(socket, io) {
    socket.on('newUser', async () => {
            // const allUsers = await User.findOne('')
            socket.broadcast.emit('newUserAdded')
        })

}

function updateParticularUsersData(socket, io) {
    socket.on('updateUserData', async ({userData}) =>{
        if(userData.socketId) {
            io.to(userData.socketId).emit('setUserData', {
             userData
                })     
            }
        }
    )
}

function onDisconnect(socket, io) {
    services.ChatService.logOutCurrentUser(socket.id);
    io.emit('changeOnlineUsers')
    loggerFunction('info', `Socket ${socket.id} disconnected`)
}

sockets.init = function (server) {
    const io = require('socket.io').listen(server);
    io.on('connection', function (socket) {
        
        loggerFunction('info', `Socket ${socket.id} connected`);
        setRoomEvent(socket);
        getAllOnlineUsersEvent(socket, io);
        setUserSocketIdEvent(socket, io);
        createRoomEvent(socket);
        enterRoomEvent(socket, io);
        exitRoomEvent(socket, io);
        privateMessageEvent(socket, io)
        groupMessageEvent(socket, io)
        currentUserOnlineFiendsEvent(socket)
        updateParticularUsersData(socket, io)
        setAllUser(socket, io)
        newUserAdded(socket, io)
        

        socket.on('disconnect', function () {
            onDisconnect(socket, io);
        });

  });
    

}

module.exports = sockets;

