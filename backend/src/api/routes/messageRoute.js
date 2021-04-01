const express = require('express')
const route = express.Router({
    mergeParams: true
});
const io = require('../../loaders/socket');
const services = require('../../services')

route.post('/send-message/:receiverId', async function (req, res, next) {
    try {
        const MessageServiceInstance = new services.MessageService(
            req.params.userId,
            req.params.receiverId,
            req.body
        )
        const currentUser = await MessageServiceInstance.createMessage();
        return res.status(200).json({
            status: 200,
            message: currentUser
        })
    } catch (error) {
        return next(error)
    }
})

route.get('/messages/:recipientId', async (req, res, next) => {

    try {
        const MessageServiceInstance = new services.MessageService(
            req.params.userId,
            req.params.recipientId,
        )
        const messages = await MessageServiceInstance.getMessagesBetweenUsers();

        return res.status(200).json({
            status: 200,
            message: messages,
        })
    } catch (error) {
        return next(error)
    }
})

route.get('/messages', async (req, res, next) => {

    try {
        const MessageServiceInstance = new services.MessageService(
            req.params.userId,
        )
        const messages = await MessageServiceInstance.getCurrentUserMessages()

        return res.status(200).json({
            status: 200,
            message: messages,
        })
    } catch (error) {
        return next(error)
    }
})

route.put('/messages/:recipientId/set-read', async (req, res, next) => {

    try {
        const MessageServiceInstance = new services.MessageService(
            req.params.userId,
            req.params.recipientId,
        )
        const messages = await MessageServiceInstance.setReadMessages()

        return res.status(200).json({
            status: 200,
            message: messages,
        })
    } catch (error) {
        return next(error)
    }
})
module.exports = route;