const mongoose =  require('mongoose');
const Socket = require("../model/socket");
const User = require("../model/user");
const Group = require("../model/group");

/**CHAT ROOM METHODS */
//Set the rooms based on group names
exports.setRooms = async() =>{
    try {
        let groups = await Group.find()
        let sockets = await Socket.find()
        if (groups){
             // create a room based on the group information if it doesnt exist
             for( var i = 0; i < groups.length; i++ ) {
                if(sockets){
                    if (sockets.every(socket => !socket.name.includes(groups[i].name))){
                        let socket = new Socket();
                        socket.name = groups[i].name,
                        socket.save()

                        }
                    }
                    else{
                        let socket = new Socket();
                        socket.name = groups[i].name,
                        socket.save()
                    }
                }
                
                return  {
                success: "rooms successfully added"
            }
        }
       
    }
    catch(error){
        return{
            error: error
        }
    }
}

exports.createRoom = async (roomName ) =>{
    console.log(roomName);
    
    try {

        let socket = await Socket.create({
            name: roomName
        })

        await socket.save()
        let sockets = await Socket.find()                
        return sockets
        
    }
     catch (error) {        
        return{
            error: error
        }
    }
    

}

exports.getUsersPerRoom = async (groupId) =>{

    try {
        let group = await Group.findById(mongoose.Types.ObjectId(groupId))
        let socket = await Socket.findOne({name: group.name})
        socket =  socket.users
        return socket
    } 
    
    catch (error) {
        return{
            error:error
        }
    }
}


exports.joinRoom = async (username, socketId, groupId ) =>{
    console.log(username, socketId);
    
    try {

        let group = await Group.findById(mongoose.Types.ObjectId(groupId))
        let socket = await Socket.findOne({name: group.name})
        console.log();
        
        if(socket.users.filter(roomMember => roomMember.username === username).length === 0){            
            socket.users.push({
                username: username,
                socketId: socketId
            })
        
            await socket.save()
        }
        else{
            socket.users.map(roomMember => {
                return roomMember.username === username  ? 
                ({...roomMember, socketId}) :
                roomMember
        })
        await socket.save()

    }
        socket = await Socket.find({
            name: group.name
        })
        return{
            socket
        }
    } 
    catch (error) {
        return{
            error: error
        }
    }
}


//user leave room by room Id
exports.leaveRoom = async function(username, roomId){
    try {
        let group = await Group.findById(mongoose.Types.ObjectId(roomId))
        let socket = await Socket.findOne({
            name: group.name
        })

        if(socket){
            await socket.leaveRoom(username)
        }
        socket = await Socket.find({
            name: group.name
        })

        return  {socket}
    } 

    catch (error) { 
        return { error: error}
    }
    
}

// remove user from all rooms when he disconnects
exports.logout = async function(socketId){  

    try {
        let now = new Date()
        let user = await User.findOne({
            socketId: socketId
        })
        user.lastOnline = now 
        user.socketId = null
        await user.save()
    }
    catch (error) {
    }
    
}

exports.getUser =  async (userId, groupId ) =>{
    let group = await Group.findById(mongoose.Types.ObjectId(groupId))
    let user = await User.findById(mongoose.Types.ObjectId(userId))
    let username = user.username    
    let room = group.name
    socket = await Socket.findOne({
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

exports.setUserSocketId = async (username, socketId) =>{

    try {

        let user = await User.findOne({
        username: username
        })        
        user.socketId = socketId;
        await user.save()
        return{
            socket: `:${username} given socket id`
        }
        
    } 
        catch (error) {

            return {
            error: error,
        }
    }
}


exports.getUserSocketId = async (username) =>{

    try {

        let user = await User.findOne({
            username: username
        })        
        return user.socketId;
    }   catch (error) {        
            return {
                error: error,
            }

    }    
}


exports.getOnlineFriends = async (username) =>{
    let user = await User.findOne({
        username: username
    })
    let users = await User.find()
    let onlineUsers = await User.find({"socketId":{$ne: null}});
    let onlineFriends = user.friends.map(friend => ({
        username:friend.userInfo.username,
        isOnline: onlineUsers.some(user => user.username === friend.userInfo.username),
        lastOnline: users.filter( user => user.username === friend.userInfo.username)[0].lastOnline
            }
        )
    )        
    return onlineFriends
    
}