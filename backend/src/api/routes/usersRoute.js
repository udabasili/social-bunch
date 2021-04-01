const express = require('express');
const Logger = require('../../loaders/logger');
const route = express.Router({
    mergeParams: true
})
const service = require('../../services');
const io = require('../../loaders/socket');

route.get('/', async function (req, res, next) {
    try {
        const users = await service.UsersService.getAllUsers()
        io.getIO().emit('users', {
            action: 'updatedUsers',
            payload: users
        })
        return res.status(200).json({
            status: 200,
            message: users
        })
    } catch (error) {
        return next(error)
    }

})

route.get('/:userId', async function (req, res, next) {
    try {
        const userId = req.params.userId
        const users = await service.UsersService.getUserById(userId)
        return res.status(200).json({
            status: 200,
            message: users
        })
    } catch (error) {
        return next(error)
    }

})

module.exports = route