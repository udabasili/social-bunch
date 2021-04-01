const express = require('express');
const Logger = require('../../loaders/logger');
const route = express.Router({
    mergeParams: true
})
const services = require('../../services');

route.get('/csrf-token', async function (req, res, next) {
    return res.json({ csrfToken: req.csrfToken() });

})

route.get('/events', async (req, res, next) => {
    try {
        const EventServiceInstance = new services.EventService()
        const events = await EventServiceInstance.getAllEvents()
        Logger.info('All Events gotten  from Event Model in database')
        return res.status(200).json({
            status: 200,
            message: events
        })
    } catch (error) {
        return next(error)
    }
})

route.get('/groups', async (req, res, next) => {
    try {
        const GroupServiceInstance = new services.GroupService()
        const groups = await GroupServiceInstance.getAllGroups()
        Logger.info('All Events gotten  from Event Model in database')
        return res.status(200).json({
            status: 200,
            message: groups
        })
    } catch (error) {
        return next(error)
    }
})


module.exports = route