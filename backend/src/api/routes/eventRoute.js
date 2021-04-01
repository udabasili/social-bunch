const express = require('express')
const route = express.Router({mergeParams: true})
const Logger = require('../../loaders/logger')
const services = require('../../services')
const logger = Logger
const io = require("../../loaders/socket");

route.post('/create-event/', async (req, res, next) =>{
    try {
        let currentUser = req.currentUser;
        const EventServiceInstance = new services.EventService(currentUser, req.body)
        const {event, events} = await EventServiceInstance.createEvent()
        io.getIO().emit('events', {
            action: 'New Event',
            payload: events
        })
        logger.debug(`${currentUser.username} created a new event`)
        return res.status(200).json({
            status:200,
            message: events
            })
          
        } 
    catch (error) {        
        return next(error)
    }

})

route.delete('/event/:eventId/delete',async (req, res, next) => {
    try {
        const eventId = req.params.eventId
        const EventServiceInstance = new services.EventService(null, null, eventId)
        const allEvents = await EventServiceInstance.deleteEvent()
        io.getIO().emit('events', {
            action: ' Event deleted',
            payload: allEvents
        })
        return res.status(200).json({
            status:200,
            message:allEvents
            })
    }  
    catch (error) {
        return next(error)
        }     
    }
)

route.get('/event/:eventId/join', async (req, res, next) =>{
    
    try {
        let currentUser = req.currentUser;
        const eventId = req.params.eventId
        const EventServiceInstance = new services.EventService(currentUser, null, eventId)
        const allEvents = await EventServiceInstance.joinEvent()
        io.getIO().emit('events', {
            action: ' Event joined',
            payload: allEvents
        })
        return res.status(200).json({
            status:200,
            message:allEvents
        })
    } 
    catch (error) {
        return next(error)
        }     
    }
)

route.get('/event/:eventId/leave', async (req, res, next) =>{
    
    try {
        let currentUser = req.currentUser;
        const eventId = req.params.eventId;
        const EventServiceInstance = new services.EventService(currentUser, null, eventId)
        const allEvents = await EventServiceInstance.leaveEvent()
        io.getIO().emit('events', {
            action: ' Event left',
            payload: allEvents
        })
        return res.status(200).json({
            status:200,
            message:allEvents
        })
    } 
     catch (error) {
        return next(error)
        }     
})

module.exports = route