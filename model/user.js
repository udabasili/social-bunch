const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const path = require('path')

const Schema = mongoose.Schema;

const userSchema = new Schema({
        username:{
            type: String,
            required:true,
            unique:true
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
        friends:[
            {
                userInfo:{},
                messages:[{
                    type: mongoose.Schema.Types.ObjectId,
                    ref:"Message"
                }]
            }
        ],
        friendsRequest:[
            {
                userInfo:{}
            }
        ]
    },
    {
        timestamps:true
    })

userSchema.methods.encryptPassword =  async function(req, res, next){
    try {
    
        console.log(this.password);
        
        let hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword
        this.save()
    } catch (error) {
        return next(error)
    }
    
}

userSchema.methods.comparePassword = async function (userConfirmPassword, next) {
    try {
        let passwordCheck = await bcrypt.compare(userConfirmPassword, this.password)
        console.log(typeof userConfirmPassword);
                
        return passwordCheck;

    } catch (error) {
        return next(error)

    }
}
userSchema.methods.uploadImage =  function(imageBuffer){
    try {
        this.userImage = imageBuffer
        return this.save();
    } catch (error) {
        return next(error)
    }
}

userSchema.methods.addFriends = async function(addedFriend) {
    try {
        let updatedFriendsList = [...this.friends]
        //check if friend already exists 
        let existingFriend = updatedFriendsList.findIndex((friend)=>{
            friend.userInfo._id.toString() === addedFriend._id.toString()
        })
        if (existingFriend !== -1){
            return;
        }
 
        updatedFriendsList.push({
            userInfo:addedFriend,
            messages:[]
        })
        this.friends = updatedFriendsList;
        return this.save()

    } catch (error) {
        console.log(error);
        
        return (error)   
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