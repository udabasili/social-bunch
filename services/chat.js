const logger = require('../loaders/logger');
const Models = require('../models')
const mongoose =  require('mongoose');
/**
 * Handles socket functionalities
 */
class ChatService {

    static async createRoom(roomName){
        let room = await Models.Room.create({
            name: roomName
        })
        await room.save()
        let rooms = await Models.Room.find()
        logger('info', `room ${roomName} has been created`)                
        return rooms
    }

    static async joinRoom(username, socketId, groupId){
        let group = await Models.Group.findById(mongoose.Types.ObjectId(groupId));
        let room = await Models.Room.findOne({name: group.name});        
        if(room.users.filter(roomMember => roomMember.username === username).length === 0){            
            room.users.push({
                username,
                socketId
            })
        
            await room.save()
        }
        else{
            room.users.map(roomMember => {
                return roomMember.username === username  ? 
                ({...roomMember, socketId}) :
                roomMember
            })
            await room.save();
        }
        room = await Models.Room.find({
            name: group.name
        })
        logger('info', `${username} has joined room ${room[0].name}`)                
        return room
   }

    static async leaveRoom(username, roomId){
        let group = await Models.Group.findById(mongoose.Types.ObjectId(roomId))
        let room = await Models.Room.findOne({
            name: group.name
        })
        if(room){
            await room.leaveRoom(username)
        }
        room = await Models.Room.find({
            name: group.name
        })
        logger('info', `${username} has left room ${room[0].name}`)                
        return  room
    }

    /**
     * Setting values for room model
    */
    static async setRooms(){
        try {
            let groups = await Models.Group.find()
            let rooms = await Models.Room.find()
            if (groups){
                for( var i = 0; i < groups.length; i++ ) {
                    if(rooms){
                        if (rooms.every(room => !room.name.includes(groups[i].name))){
                            let room = new Models.Room();
                            room.name = groups[i].name,
                            room.save()
                            }
                        }
                        else{
                            let room = new Models.Room();
                            room.name = groups[i].name,
                            room.save()
                        }
                    }
                return   'rooms successfully created'
            }
        }
        catch(error){
            return error
        }
    }

    static async getRoomInfo(userId, groupId){
        let group = await Models.Group.findById(mongoose.Types.ObjectId(groupId))
        let user = await Models.User.findById(mongoose.Types.ObjectId(userId))
        let username = user.username    
        let room = group.name
        room = await Models.Room.findOne({
            name: room
        })   
        if(user){
            let response = {
                username,
                room
        }
        return response;
        }
    }

    static async currentUserOnlineFriends(username){
        let user = await Models.User.findOne({
            username: username
        })
        let users = await Models.User.find()
        let onlineUsers = await Models.User.find({'socketId':{$ne: null}});
        let onlineFriends = user.friends.map(friend => ({
            username:friend.userInfo.username,
            isOnline: onlineUsers.some(user => user.username === friend.userInfo.username),
            lastOnline: users.filter( user => user.username === friend.userInfo.username)[0].lastOnline
                }
            )
        )        
        logger('info', `${username} has online friends`)                
        return onlineFriends
    }

    static async getUserSocketId(receiver, sender){
        let userReceiver = await Models.User.findOne({
            username: receiver
        })
        let userSender = await Models.User.findOne({
            username: sender
        })        
        const filteredData = await userSender.filterUserData()
        logger('info', `${sender} messaged ${receiver}`)                

        return {
            socketId: userReceiver.socketId,
            userSender: filteredData
        }
    }
    
    static async logOutCurrentUser(socketId){
        let now = new Date();
        let user = await Models.User.findOne({
            socketId: socketId
        })
        if (user){            
            user.lastOnline = now;
            user.socketId = null;
            await user.save();
            logger('info', `${user.username} has logged out`)                

        }
    }
    static async setUserSocketId(username, socketId){
        let user = await Models.User.findOne({
            username: username
        })        
        user.socketId = socketId;
        await user.save()
        logger('info', `${username} has the socket id set in database`)                

    }

    static async getOnlineUsers(){
        const users = await Models.User.find();
        const filteredData =  await Models.User.filterData(users);
        let onlineUsers = await Models.User.find({'socketId':{$ne: null}});
        onlineUsers = users.map(user => ({
            username:user.username,
            isOnline: onlineUsers.some(online => online.username === user.username),
            lastOnline: user.lastOnline
            })
        )
        
        return {
            users: filteredData,
            onlineUsers
        }
    }
}

module.exports = ChatService;