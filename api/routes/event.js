const express = require('express')
const route = express.Router({mergeParams: true})
const logger = require('../../loaders/logger')
const services = require('../../services')

route.post('/create-event/', async (req, res, next) =>{
    try {
        let currentUser = req.currentUser;
        const EventService = new services.EventService(currentUser, req.body)
        const {event, events} = await EventService.createEvent()
        logger('info', `${currentUser.username} created a new event`)
        return res.status(200).json({
            status:200,
            message:{
                events,
                eventId: event._id
                }
            })
          
        } 
    catch (error) {        
        return next(error)
    }

})

route.get('/event/:eventId/delete',async (req, res, next) => {
    try {
        const eventId = req.params.eventId
        const EventService = new services.EventService(null, null, eventId)
        const allEvents = await EventService.deleteEvent()       
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
        const EventService = new services.EventService(currentUser, null, eventId)
        const allEvents = await EventService.joinEvent()
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
        const EventService = new services.EventService(currentUser, null, eventId)
        const allEvents = await EventService.leaveEvent()
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