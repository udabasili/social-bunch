const mongoose = require("mongoose")
const Group = require("../model/group")

exports.createGroup = async (req, res, next) =>{
    try {
        let group = await Group.create(req.body)
        await group.save()
        let groups = await Group.find()
        return res.status(200).json({
            status:200,
            message:{
                groups,
                groupId: group._id
            }
        })          
    } 
     catch (error) {
        return next(error)
    }     
    

}

exports.getGroup = async (req, res, next) =>{
    try {        
        let groupId = mongoose.Types.ObjectId(req.params.groupId);
        let group = await Group.findById(groupId)        
        return res.status(200).json({
            status:200,
            message:group
        })    
    } 
    catch (error) {                
        return next({
            status:500,
            message:error.message
        })
    }
}


exports.getGroups = async (req, res, next) =>{
    try {
        let groups = await Group.find()
        return res.status(200).json({
            status:200,
            message:groups
        })    
    } 
     catch (error) {
        return next(error)
    }     
}


exports.joinGroup = async (req, res, next) =>{
    let currentUser = req.user
    let groupId= mongoose.Types.ObjectId(req.params.groupId)

    try {
        let group = await  Group.findById(groupId)
        group.members.push(currentUser.username)
        await group.save()
        let groups = await Group.find()
        return res.status(200).json({
            status:200,
            message:groups
        })

    }     
    catch (error) {
        return next(error)
    }     
    

}

exports.leaveGroup = async (req, res, next) =>{
    let currentUser = req.user
    try {
        let groupId = mongoose.Types.ObjectId(req.params.groupId)
        let group = await Group.findById(groupId)
        await group.removeMember(currentUser.username)
        let groups = await Group.find()
        return res.status(200).json({
            status:200,
            message:groups
        })
    } 
    catch (error) {
        return next(error)
    }

}

exports.removeGroup = async (req, res, next) =>{
    try {
        let eventId = mongoose.Types.ObjectId(req.params.eventId)        
        await Group.findByIdAndRemove(req.params.groupId)
        let groups = await Group.find()
        return res.status(200).json({
            status:200,
            message:groups
        })
    }  catch (error) {
        return next(error)
    }     
    

}