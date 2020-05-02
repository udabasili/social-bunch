const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Group = require('./group')

const roomSchema = new Schema({
    name:{
        type:String,
        unique:true,
    },
    users:[{
        socketId: {
            type: String,
        },
        username:{
            type:String,
        }
    }]
})

roomSchema.methods.setRoomsByUser = async function (socketId) {
    let rooms = [...this.room]
    try {
        let groups = await Group.find()
         groups.forEach((group)=>{             
            if(group.members.includes(this.username) && !this.room.includes(group.name)){
                rooms.push(group.name)

            }
        })
        this.room = rooms;
        this.socketId = socketId;
        return this.save()
    } catch (error) {
        
    }
}



roomSchema.methods.leaveRoom = async function(username){
    let users = [...this.users]
    users = users.filter((user)=> user.username !== username)
    this.users = users;
    return this.save()
}

module.exports = mongoose.model('Room', roomSchema)