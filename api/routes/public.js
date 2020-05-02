const express = require('express');
const route = express.Router({mergeParams: true});
const Model = require('../../models');
const logger = require('../../loaders/logger')

route.get('/events', async (req, res, next) =>{
    try {
        let events= await Model.Event.find({})
        logger('info', 'All Events gotten  from Event Model in database')
        return res.status(200).json({
            status:200,
            message:events
            })
        } 
     catch (error) {
        return next(error)
    }     
})

route.get('/groups', async (req, res, next)  => {
    try {
        const groups = await Model.Group.find();
        logger('info', 'All Groups gotten from Group Model in database')
        return res.status(200).json({
            status:200,
            message:groups
        })    
    } 
     catch (error) {
        return next(error)
    } 
})

route.get('/users', async function(req, res, next){
    try {
        let users = await Model.User.find() 
        let filteredData =  await Model.User.filterData(users);
        logger('info', 'All Users gotten from User Model in database')
        return res.status(200).json({
            status:200,
            message:filteredData
        })
    } catch (error) {
        return next(error)    
        }
    }
)


module.exports = route