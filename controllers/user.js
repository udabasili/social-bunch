const User = require("../model/user");
const Event = require("../model/event");
const Group = require("../model/group");
const mongoose = require("mongoose");
const token =require("../utils/token");


const api = process.env.GOOGLE_API;

const googleMapsClient = require('@google/maps').createClient({
    key: api,
    Promise: Promise


});


exports.signUp = async function(req, res, next){
    try {
        let imageBuffer = req.files["file"][0].buffer;
        let userData= JSON.parse(req.body.data);
        let newUser = await User.create(userData);
        await newUser.encryptPassword()
        await newUser.uploadImage(imageBuffer)
        await newUser.save()
        return res.status(200).json({
            status:200,
            message:"success"
        })
    } catch (error) {        
        if (error.code ===11000) {
          error.message = "Sorry, this email/username is taken" ;
        }
        return next({
            status:500,
            message:error.message
        })
    }
}


exports.signIn = async function (req, res, next) {
    try {
        let user = await User.findOne({
            email: req.body.email
        })
        if (!user){
                return next({
                    status:404,
                    message: "Email doesn't exist. Please Register"
            })
        }
        let isMatched = await user.comparePassword(req.body.password)        
        if(isMatched){
            let generateToken = token(user)
            const filteredData = user.filterUserData()
            
            return res.status(200).json({
                status:200,
                message:{
                validator:generateToken,
                currentUser:filteredData
                }
            })
        }
        else {
            return next({
                status:404,
                message: "Email/Password is incorrect"
            })
        }

        } catch (error) {
            return next({
                status:500,
                message: error.message
            })
            
    }
}


exports.editUser = async function(req, res, next){
    try{
        let updatedUserData = req.body        
        let userId = mongoose.Types.ObjectId(req.params.userId);
        
        let user = await User.findOneAndUpdate({_id:userId}, 
            {$set:updatedUserData})
        user = await User.findById(userId)        
        let filteredData = await user.filterUserData()
        return res.status(200).json({
            status:200,
            message:filteredData
        })
    }  
    catch (error) {
        return next(error)
        }     
    }


exports.acceptFriend = async function(req, res, next){
    try {

        let userId = mongoose.Types.ObjectId(req.params.userId);
        let friendId = mongoose.Types.ObjectId(req.params.addedUserId);
        let user = await User.findById(userId)
        let friend = await User.findById(friendId)
        let filteredFriendData = await friend.filterUserData()
        await user.addFriend(filteredFriendData)
        await friend.addFriend(req.user)
        await user.removeFriendRequest(friend)
        let users = await User.find()
        user = await User.findById(userId)
        let filteredUser = await user.filterUserData()
        let filteredUsers =  await User.filterData(users)
        return res.status(200).json({
            status:200,
            message:{
                filteredUser,
                filteredUsers
            }
        })
        
    }  catch (error) {
        return next(error)
    }     
    
}

exports.rejectFriend = async function(req, res, next){
    try {
        let userId = mongoose.Types.ObjectId(req.params.userId);
        let senderId = mongoose.Types.ObjectId(req.params.addedUserId);
        let user = await User.findById(userId)
        let sender = await User.findById(senderId)
        user.removeFriendRequest(sender)
        let users = await User.find()
        user = await User.findById(userId)
        let filteredUser = await user.filterUserData()
        let filteredUsers =  await User.filterData(users)
        return res.status(200).json({
            status:200,
            message:{
                filteredUser,
                filteredUsers
            }
        })
    } catch (error) {

        return ({
            status:500,
            message:error.message
        })
        
    }
}
    
exports.sendFriendRequest = async function(req, res, next){
    try {
        let senderId = mongoose.Types.ObjectId(req.params.userId);
        let receiverId = mongoose.Types.ObjectId(req.params.addedUserId);
        console.log(senderId, receiverId)
        let userReceiver = await User.findById(receiverId)
        let userSender = await User.findById(senderId)
        let filteredSenderData = await userSender.filterUserData()
        userSender.requestsSent.push({
            sentTo: userReceiver.username,
            status:"pending"
        })
        await userSender.save()
        await userReceiver.sendFriendRequest(filteredSenderData)
        user = await User.findById(senderId)
        let filteredUser = await user.filterUserData()
        return res.status(200).json({
            status:200,
            message:filteredUser

        })
    } catch (error) {
        console.log(error);
        
        return (next)
        
    }
        
    
}
exports.getUserEvents = async (req, res, next) =>{
    try {
        let currentUser = req.user
        let events = await Event.find({})
        let userEvents = events.map((event)=>(
            event.attenders.find((attender)=>{
                return attender.username === currentUser.username
                })
            ))
        return res.status(200).json({
            status:200,
            message:userEvents
            })
    } 
     catch (error) {
        return next(error)
    }     
    }


exports.getUserGroups = async (req, res, next) =>{
    try {
        let currentUser = req.user
        let groups= Group.find({})
        let userGroups = groups.map((group)=>(
            group.members.find((attender)=>{
                return attender.username === currentUser.username
            })
        ))
        return res.status(200).json({
            status:200,
            message:userGroups
        })
    } 
     catch (error) {
        return next(error)
    }     
    
}

exports.getUserFriends = async (req, res, next) =>{
    try {
        let currentUser = req.user
        let user = User.find({username : currentUser.username})
        return res.status(200).json({
            status:200,
            message:user.friends
            })
    } 
     catch (error) {
        return next(error)
    }     
    }

exports.getLocation = (req, res, next) =>{    
        let lat  = req.body.lat
        let long = req.body.long
        googleMapsClient.reverseGeocode({
            latlng: [lat, long]
        })
        .asPromise()
        .then((response) => {
            console.log(response);
            
            if(response.json.status === "OK"){
                let location  = response.json.results[8].formatted_address
                console.log(location)
                return  res.status(200).json({
                            status:200,
                            message: location
                        })
                    }
            else{
                console.log(response.json);
                
                return next({
                    error: 404,
                    message:"Location not found"
                })
            }
        }).catch((err) => {
            console.log(err);
            
            return next({
                    error: 500,
                    message:"Location not found"
                })
        });

        
   
}