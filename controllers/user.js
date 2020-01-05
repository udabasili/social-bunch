const User = require("../model/user");
const Event = require("../model/event");
const Group = require("../model/group");

const token =require("../utils/token")

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
            message:"successful register"
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
        console.log( user);
        if (!user){
                return next({
                    status:404,
                    message: "Email doesn't exist. Please Register"
            })
        }
        let isMatched = await user.comparePassword(req.body.password)
        console.log(isMatched);
        
        if(isMatched){
            let generateToken = token(user)
            const filteredData = user.filterUserData()
            
            return res.status(200).json({
                status:200,
                validator:generateToken,
                currentUser:filteredData
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
        let user = await User.findOneAndUpdate({
                email
            }, updatedUserData, {new: true} )
        await user.save()
        let filteredData = await user.filterUserData()
        return res.status(200).json({
            status:200,
            message:filteredData
        })
  
    } catch (error) {
        return next({
            status:500,
            message:error.message
        })
    }
}

exports.addFriend = async function(req, res, next){
    try {
        let friendToAddUsername = req.body.addedUserUsername
        let friendApprovalStatus = req.body.approvalStatus
        let user = await User.findOne({
            username: req.user.username

        })
        let addedFriend = await User.findOne({
            username: friendToAddUsername
        })
        let filteredFriendData = await addedFriend.filterUserData()
        
        if(friendApprovalStatus === "accepted"){
            user.addFriends(filteredFriendData)
            addedFriend.addFriends(req.user)
            }
        user = await User.findOne({
            username: req.user.username

        })
        user = user.filterUserData()

        return res.status(200).json({
            status:200,
            message:user
            })
        
    } catch (error) {
        return next({
            status:500,
            message:error.message
        })
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
        return next({
            status:500,
            message:error.message
        })
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
        return next({
            status:500,
            message:error.message
        })
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
        return next({
            status:500,
            message:error.message
        })
    }
}