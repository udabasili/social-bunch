const Logger = require("../loaders/logger");
const models = require('../models')
const token = require('../loaders/token')
const mongoose = require("mongoose");

/**
 * Handles the functions for authentication
 * @class AuthService
 */
class AuthService{

    /**
     * Creates an instance of AuthService.
     * @param {object} user
     * @param {string} [imageUrl=null]
     * @memberof AuthService
     */
    constructor(user) {
        this.user = user;
    }

    async SignUp() {
        let newUser = await models.UserModel.create({
            ...this.user,
            fullAuthenticated: false
        });
        await newUser.encryptPassword()
        newUser = await newUser.save();
        return newUser
    }

    async editUser(userId) {
        const updatedUser = await models.UserModel.findOneAndUpdate({
                _id: mongoose.Types.ObjectId(userId)
            }, {
                $set: {
                    ...this.user,
                    fullAuthenticated: true,
                    nextRoute:''
                },

            }, {
                new: true
            })
            .select('-email -password -refreshToken -refreshTokenExpiration')
            .populate('friends', ['username', 'userImage'])
        const accessToken = await token.generateAccessToken(updatedUser._id, 'social-bunch')
        const refreshToken = await token.generateRefreshToken(updatedUser._id, 'social-bunch')
        Logger.info(`${updatedUser.username} edited  profile`)
         return {
             updatedUser,
             accessToken,
             refreshToken
         }
    }

    static async uploadImage(userId, userImage) {
        const filter = {
            _id: mongoose.Types.ObjectId(userId)
        }
        const query = {
            $set: {
                userImage,
                fullAuthenticated: false,
                nextRoute: 'user-info'
            }
        }
        const user = await models.UserModel.findByIdAndUpdate(filter, query, {
            new: true
        })
        .select('-email -password -refreshToken -refreshTokenExpiration')
        
        return user
    }

    async SignIn() {
        const {
            email,
            password
        } = this.user;
        let currentUser = await models.UserModel.findOne({
                email
            })

        if (!currentUser) {
            throw new Error('This User is not yet registered');
        }
        let isMatched = await currentUser.comparePassword(password);
        if (isMatched) {
            currentUser = currentUser.filterData()
            const accessToken = await token.generateAccessToken(currentUser._id, 'social-bunch')
            const refreshToken = await token.generateRefreshToken(currentUser._id, 'social-bunch')
            return {
                currentUser,
                accessToken,
                refreshToken
            }
        } else {
            throw new Error('Email/Password is incorrect');
        }
    }
}

module.exports = AuthService;