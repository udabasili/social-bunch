const express = require('express');
const Logger = require('../../loaders/logger');
const route = express.Router({
    mergeParams: true
})
const service = require('../../services');
const io = require('../../loaders/socket');

route.put('/notifications/:notificationId/edit', async function (req, res, next) {
    try {
        const userId = req.currentUser._id
        const notifications = await service.NotificationService.editNotification(
            req.params.notificationId, 
            userId
        )
        io.getIO().emit('notifications', {
            action: 'newNotification',
            updateNotification: notifications
        })
        return res.status(200).end()
    } catch (error) {
        return next(error)
    }

})

module.exports = route