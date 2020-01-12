const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

const userSchema = new Schema({
        username:{
            type: String,
            required:true,
            unique:true
        },
        socketId:{
            type: String
        },
        email:{
            type:String,
            required:true,
            unique:true
        },
        password:{
            type:String,
            required:true,
        },
        userImage:{
            type:Buffer,
        },
        bio:{
            type:String
        },
        phoneNumber:{
            type:String
        },
        occupation:{
            type:String
        },
        location:{
            type:String
        },
        lastOnline:{
            type:Date
        },
        friends:[
            {
                userInfo:{},
                messages:[]
            }
        ],
        friendsRequests:[
            {
                userInfo:{},
                status:{
                type: String
            }
            }
        ],
        requestsSent:[{
            sentTo:{
                type: String
            },
            status:{
                type: String
            }
        }]
    },
    {
        timestamps:true
    })

userSchema.methods.encryptPassword =  async function(req, res, next){
    try {
        
        let hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword
    } catch (error) {
        return next(error)
    }
    
}

userSchema.methods.comparePassword = async function (userConfirmPassword, next) {
    try {
        let passwordCheck = await bcrypt.compare(userConfirmPassword, this.password)                
        return passwordCheck;

    } catch (error) {
        return next(error)

    }
}
userSchema.methods.uploadImage =  function(imageBuffer){
    try {
        this.userImage = imageBuffer
    } catch (error) {
        return next(error)
    }
}

userSchema.methods.addFriend = async function(friend) {
    try {
        let updatedFriendList = [...this.friends]
        let existingFriend = updatedFriendList.findIndex((friendList)=>(
            friendList.userInfo._id.toString() === friend._id.toString()
        ))
        if (existingFriend !== -1){
            return;
        }
 
        updatedFriendList.push({
            userInfo:friend,
            messages:[]
        })
        this.friends = updatedFriendList;
        return this.save()

    } catch (error) {        
        return (error)   
    }
    
}

userSchema.methods.removeFriendRequest = async function(sender) {
    try {
        let updatedFriendRequestList = [...this.friendsRequests]
        //check if friend already exists 
        updatedFriendRequestList = updatedFriendRequestList.filter((friend)=>(
            friend.userInfo._id.toString() !== sender._id.toString()
        ))

        this.friendsRequests = updatedFriendRequestList;
        return this.save()

    } catch (error) {
        
        return (error)   
    }
    
}

userSchema.methods.sendFriendRequest = async function(sender) {
    try {
        let updatedFriendRequestList = [...this.friendsRequests]
        //check if friend already exists 
        let existingFriendRequest = updatedFriendRequestList.findIndex((friend)=>(
            friend.userInfo._id.toString() === sender._id.toString()
        ))
        if (existingFriendRequest !== -1){
            return;
        }
 
        updatedFriendRequestList.push({
            userInfo:sender,
            status:"pending"
        })

        this.friendsRequests = updatedFriendRequestList;
        return this.save()

    } catch (error) {        
        return (error)   
    }
    
}

userSchema.methods.saveMessage = function(user, message, type) {
    try {

        let friends = [...this.friends]
        let friendIndex = friends.findIndex((friend)=>(
            friend.userInfo.username === user.username
        ))
        
        if (friendIndex !== -1){
            friends[friendIndex].messages.push(message)
        }

        this.friends = friends;
        return this.save()
        
    } catch (error) { 
    }
}

//get message based on a user's friend
userSchema.methods.getMessages = function(user) {
    try {
        let messages = []
        let friendIndex = this.friends.findIndex((friend)=>(
            friend.userInfo.username === user.username
        ))
        
        if (friendIndex !== -1){
            messages = this.friends[friendIndex].messages
        }        
        return messages;
        
    } catch (error) {
        
    }
    

}

userSchema.methods.filterUserData = function() {

        let obj = this.toObject();
        delete obj.password;
        delete obj.email;
        return obj;
}
//remove password,emaila nd friends from data before
userSchema.statics.filterData = function(users) {
        try {
            return users.map((user)=>{
                let obj = user.toObject();        
                delete obj.friends 
                delete obj.friendsRequests
                delete obj.lastOnline
                delete obj.socketId
                delete obj.password;
                delete obj.email;
                delete obj.friends;
                return obj;
    })  
        } catch (error) {
            console.log(error);
            
        }
          
}
module.exports = mongoose.model("User", userSchema)