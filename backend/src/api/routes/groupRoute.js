const express = require('express')
const route = express.Router({mergeParams: true})
const services = require('../../services');
const Models = require('../../models')
const mongoose = require('mongoose');
const io = require('../../loaders/socket');

route.post('/create-group/', async (req, res, next) =>{
    try {
        let currentUser = req.currentUser;
        const GroupService = new services.GroupService(currentUser, req.body)
        const groups = await GroupService.createGroup()
        io.getIO().emit('groups', {
            action: 'new Group Created',
            payload: groups
        })
        return res.status(200).json({
            status:200,
            message:groups
        })
    } 
    catch (error) {     
        if (error.code === 11000) {
            error.message = 'Sorry, group name is taken' ;
          }   
        return next(error)
    }
})

route.delete('/group/:groupId/delete',async (req, res, next) => {
    try {
        const groupId = req.params.groupId
        const GroupService = new services.GroupService(null, null, groupId)
        const allGroups = await GroupService.deleteGroup()   
        io.getIO().emit('groups', {
            action: 'Group deleted',
            payload: allGroups
        })
        return res.status(200).json({
            status:200,
            message:allGroups
        })
    }  
    catch (error) {
        return next(error)
        }     
    }
)

route.get('/group/:groupId/join', async (req, res, next) =>{
    
    try {
        let currentUser = req.currentUser;
        const groupId = req.params.groupId;
        const GroupService = new services.GroupService(currentUser, null, groupId)
        const allGroups = await GroupService.joinGroup()
        io.getIO().emit('groups', {
            action: 'Joined Group',
            payload: allGroups
        })
        return res.status(200).json({
            status:200,
            message:allGroups
        })
    } 
     catch (error) {
        return next(error)
        }     
    }
)

route.get('/group/:groupId/leave', async (req, res, next) =>{
    
    try {
        let currentUser = req.currentUser;
        const groupId = req.params.groupId;
        const GroupService = new services.GroupService(currentUser, null, groupId);
        const allGroups = await GroupService.leaveGroup()
        io.getIO().emit('groups', {
            action: 'Member left group deleted',
            payload: allGroups
        })
        return res.status(200).json({
            status:200,
            message:allGroups
        })
    } 
     catch (error) {
        return next(error)
    }     
})

route.get('/group/:groupId', async (req, res, next) =>{
    try {        
        let groupId = mongoose.Types.ObjectId(req.params.groupId);
        let group = await Models.Group.findById(groupId)        
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
})


module.exports = route