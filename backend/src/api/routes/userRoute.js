const express = require('express');
const Logger = require('../../loaders/logger');
const route = express.Router({
    mergeParams: true
})
const service = require('../../services');
const io = require('../../loaders/socket');
const logger = Logger;

route.put('/friends/add/:friendId', async function (req, res, next) {
    try {
        const addedFriend = req.params.friendId;
        const user = req.currentUser._id;
        const userServiceInstance = new service.UserService( addedFriend, user);
        const currentUser = await userServiceInstance.addFriend();
        const allUsers = await service.UsersService.getAllUsers()
        io.getIO().emit('users', {
            action: 'updatedUsers',
            payload: allUsers
        })
        return res.status(200).json({
            status: 200,
            message: currentUser
        })
    } catch (error) {
        logger.error('🔥 error: %o', error)
        return next(error)
    }

})

route.delete('/friends/remove/:friendId', async function (req, res, next) {
    try {
        const addedFriend = req.params.friendId;
        const user = req.currentUser._id;
        const userServiceInstance = new service.UserService(addedFriend, user);
        const currentUser = await userServiceInstance.removeFriend();
        const allUsers = await service.UsersService.getAllUsers()
        io.getIO().emit('users', {
            action: 'updatedUsers',
            payload: allUsers
        })
        return res.status(200).json({
            status: 200,
            message: currentUser
        })
    } catch (error) {
        logger.error('🔥 error: %o', error)
        return next(error)
    }

})

module.exports = route