const loggerFunction = require('./logger')
const services = require('../services');
const { User } = require('../models');
const { getUserSocketId } = require('../services/chat');
const sockets = {};
var init = null
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
        const { users, onlineUsers } = await services.ChatService.getOnlineUsers()
        io.emit('onlineUsers', {
            users,
            usersStatus: onlineUsers
            })
        
    })
}

/**
 * listener to set current users socket id
 * @param {*} socket 
 */
function setUserSocketIdEvent(socket, io){
    socket.on('login',async ({username},callback) => {   
            await services.ChatService.setUserSocketId(username, socket.id)
            const { users, onlineUsers } = await services.ChatService.getOnlineUsers()
            io.emit('onlineUsers', {
                users,
                usersStatus: onlineUsers
            })
        
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
        const MessageService = new services.MessageService(sender, receiver)
            const messages = await MessageService.getMessagesBetweenUsers();
            io.emit('privateMessage', {
                messages,
                receiver,
                sender
            })
        
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
        const { users, onlineUsers } = await services.ChatService.getOnlineUsers()
        socket.broadcast.emit('newUserAdded', {
        users,
        usersStatus: onlineUsers
    })
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

/** 
 * VIDEO CHAT
 * 
*/

function makeVideoCallWithUser(socket, io){
    socket.on('video-offer-1',async ({name,target, sdp}) =>{
        const {caller, receiver} = await services.VideoService.makeCall(name, target)
        let msg = {
            name,
            target, 
            sdp
        }
         io.to(receiver.socketId).emit("video-offer-2", {
            caller,
            receiver,
            msg
        });              
    }) 
}

function acceptedCallHandler(socket, io){
     socket.on("video-answer-1", ({ response, callerSocketId, receiverId }) => {
        // io.to(callerSocketId).emit("answer-made", {
        //     socketId: receiverId,
        //     response
        // });
    });
}
function iCECandidateHandler(socket, io){
    socket.on('ice-candidate', async ({target, candidate }) =>{
        const  {socketId} = await getUserSocketId(target)
        io.to(socketId).emit("ice-candidate-listener",{
            candidate
        });
    })
}

async function onDisconnect(socket, io) {
    services.ChatService.logOutCurrentUser(socket.id);
    const { users, onlineUsers } = await services.ChatService.getOnlineUsers()
    io.emit('onlineUsers', {
        users,
        usersStatus: onlineUsers
    })
    loggerFunction('info', `Socket ${socket.id} disconnected`)
}

sockets.init = function (server) {
    const io = require('socket.io').listen(server);
    init = io
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
        makeVideoCallWithUser(socket, io)
        acceptedCallHandler(socket, io)
        iCECandidateHandler(socket, io)
        socket.on('disconnect', function () {
            onDisconnect(socket, io);
        });

  });
    

}


sockets.getIo =   () =>{
    if(!init){
        throw new Error('Socket io no initialized')
    }
    return init
}

module.exports = sockets;

