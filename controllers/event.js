const Event = require("../model/event")
const mongoose= require("mongoose");
const User = require("../model/user")

exports.createEvent = async (req, res, next) =>{
    try {
        let currentUser = req.user;
        let event = await Event.create(req.body)
        event.createdBy = currentUser.username        
        event.save()
        let events = await Event.find()
        res.status(200).json({
            status:200,
            message:events
            })
          
        } 
    catch (error) {        
        if (error.code ===11000) {
          error.message = "Sorry, this email/username is taken" ;
        }
        return next({
            status:500,
            message:error.message
        })
    }

}

exports.getEvent = async (req, res, next) =>{
    try {
        let eventId= mongoose.Types.ObjectId(req.params.eventId)
        let event = await Event.findById(eventId)
        return res.status(200).json({
            status:200,
            message:event
            })
        } 
    catch (error) {
        return next({
            status:500,
            message:error.message
        })
    }
}

exports.getEvents = async (req, res, next) =>{
    try {
        let events= await Event.find({})
        return res.status(200).json({
            status:200,
            message:events
            })
        } 
    catch (error) {
        return next({
            status:500,
            message:error.message
        })
    }
}

exports.joinEvent = async (req, res, next) =>{
    
    try {
        let currentUser = req.user
        let eventId= mongoose.Types.ObjectId(req.params.eventId)
        let event = await Event.findById(eventId)
        await event.attenders.push(currentUser.username)
        await event.save()
        let allEvents = await Event.find()
        return res.status(200).json({
            status:200,
            message:allEvents
            })
        } 
    catch (error) {
        return next({
            status:500,
            message:error.message
        })
    }

}

exports.leaveEvent = async (req, res, next) =>{
    try{

        let currentUser = req.user
        let eventId = mongoose.Types.ObjectId(req.params.eventId)
        let event = await Event.findById(eventId)
        await event.removeAttender(currentUser.username)
       
        let allEvents = await Event.find()
        return res.status(200).json({
            status:200,
            message:allEvents
        })
        } 
    catch (error) {
        return next({
            status:500,
            message:error.message
        })
    }

}

exports.deleteEvent = async (req, res, next) =>{
    try {
        let eventId = mongoose.Types.ObjectId(req.params.eventId)        
        await Event.findByIdAndRemove(eventId)
        let allEvents = await Event.find()        
        return res.status(200).json({
            status:200,
            message:allEvents
            })
    } catch (error) {
        return next({
            status:500,
            message:error.message
        })
    }

}