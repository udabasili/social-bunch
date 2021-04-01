const Logger = require("../loaders/logger");
const models = require('../models')
const mongoose = require("mongoose");

class UsersService {

    static async getAllUsers() {
        const users = await models.UserModel
            .find({})
            .select(' username userImage friends posts socketId')
            .populate('friends', ['username', 'userImage'])
        return users
    }

    static async getUserById(userId) {
        const user = await models.UserModel
            .findById(mongoose.Types.ObjectId(userId))
            .select('-email -password -refreshToken -refreshTokenExpiration')
            .populate('friends', ['username', 'userImage'])
        return user
    }
}

module.exports = UsersService;