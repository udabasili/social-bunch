const Logger = require("../loaders/logger");
const models = require('../models')
const mongoose = require("mongoose");

class UserService {

    constructor(otherUserId, currentUserId){
        this.otherUserId = otherUserId;
        this.currentUserId = currentUserId;

    }

    async addFriend(){
        let filter = {
            _id: mongoose.Types.ObjectId(this.currentUserId)
        }

        let query = {
            $push: {
                friends: this.otherUserId
            }
        }

        const currentUser = await models.UserModel.findOneAndUpdate(
                                filter, 
                                query
                                , {
                                    new: true
                                })
                                .select('-email -password -refreshToken -refreshTokenExpiration')
                                .populate('friends', ['username', 'userImage'])
        filter = {
            _id: mongoose.Types.ObjectId(this.otherUserId)
        }

        query = {
            $push: {
                friends: this.currentUserId
            }
        }

        await models.UserModel.findOneAndUpdate(filter, query)
        return currentUser
    }

    async removeFriend() {
        let filter = {
            _id: mongoose.Types.ObjectId(this.currentUserId)
        }

        let query = {
            $pull: {
                friends: this.otherUserId
            }
        }

        const currentUser = await models.UserModel.findOneAndUpdate(
            filter,
            query, {
                new: true
            })
            .select('-email -password -refreshToken -refreshTokenExpiration')
            .populate('friends', ['username', 'userImage'])

        filter = {
            _id: mongoose.Types.ObjectId(this.otherUserId)
        }

        query = {
            $pull: {
                friends: this.currentUserId
            }
        }

        await models.UserModel.findOneAndUpdate(filter, query)
        return currentUser
    }
    
}

module.exports = UserService;