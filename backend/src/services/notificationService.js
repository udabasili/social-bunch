const Logger = require("../loaders/logger");
const models = require('../models')
const mongoose = require("mongoose");


class NotificationService {

    static async editNotification(id, userId) {
        console.log(userId)
        const filter = {
            _id: mongoose.Types.ObjectId(id)
        }
        
        const query = {
            $set: {
                textRead: true
            }
        }

        await models.NotificationModel.updateOne(filter, query)
        let creator = await models.UserModel.findById(mongoose.Types.ObjectId(userId))
            .select('-email -password -refreshToken -refreshTokenExpiration')
            .populate('notifications', [
                'type',
                'postId',
                'owner',
                'textRead',
                'notificationAbout',
                'createdAt'
            ])
        const notifications = creator.notifications
        return notifications

    }
}

module.exports = NotificationService;