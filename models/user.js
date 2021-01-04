const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;
const Joi = require('joi');
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
        type:String,
        required: [true, 'You must upload an image'],

    },
    bio:{
        type:String
    },
    dateOfBirth:{
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
    isAdmin:{
        type:Boolean,
        default: false
    },
    notifications:[{
        text: String,
        textRead:{
            type : Boolean,
            default: false
        }
    }],
    friends:[{
        type: Schema.ObjectId,
        ref: 'User'
    }],
    posts:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }],

    
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

userSchema.methods.comparePassword = async function (userConfirmPassword) {  
        let passwordCheck = await bcrypt.compare(userConfirmPassword, this.password)                
        return passwordCheck;
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
                delete obj.socketId
                delete obj.password;
                delete obj.email;
                return obj;
    })  
        } catch (error) {
            console.log(error);
            
        }
          
}


module.exports = mongoose.model('User', userSchema)