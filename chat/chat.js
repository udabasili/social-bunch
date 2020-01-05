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
        // create a room based on the group information if it doesnt exist
            for( var i = 0; i < groups.length; i++ ) {

                if (sockets.every(socket => !socket.name.includes(groups[i].name))){
                let socket = new Socket();
                socket.name = groups[i].name,
                socket.save()

            }
        }
        return{
            success: "completed"
        }
    }
    catch(error){
        return{
            error: error
        }
    }
}

exports.createRoom = async (roomName ) =>{

    try {
        if(!roomName){
            return{
                error:"group id must be passed in"
            }
        }

        let socket = await Socket.create({
            name: roomName
        })
        await socket.save()
        let sockets = await Socket.find()                
        return sockets
        
    } catch (error) {
        console.log(error);
        
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

    } catch (error) {
        return{
            error:error
        }
    }
}

exports.joinRoom = async (username, socketId, groupId ) =>{

    try {
        let group = await Group.findById(mongoose.Types.ObjectId(groupId))
        let socket = await Socket.findOne({name: group.name})
        //check if username, room and socketId were passed in
        if(!username || !socketId || !groupId){
            return{
                error:"username  and room must be passed in"
            }
        }
        
        

        //if user already in room, sned error, else add to room      
        if(socket.users.every(user => user.username !== username)){
            console.log("here");
            
            socket.users.push({
                username: username,
                socketId: socketId
            })
    
            await socket.save()
       
        }

        socket = await Socket.find({
            name: group.name
        })

        return{
            socket
        }
    
    } catch (error) {
        return{
            error: error
            }
    }
    

}

//add user to room when he joins and update socket id

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

        return{
            socket
        }

        
    } catch (error) {
        console.log(error
            );
        
        return {
            error: error,
        }
    }
    
}

// remove user from all rooms when he disconnects
exports.logout = async function(socketId){  
         await Socket.remove({
                socketId: socketId
            })
            return {
                message: `${socketId} has left group`
            }
        }
   
    




exports.getUser =  async (userId, groupId ) =>{
    
    let group = await Group.findById(mongoose.Types.ObjectId(groupId))
    let user = await User.findById(mongoose.Types.ObjectId(userId))
    let username = user.username
    console.log(username);
    
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

