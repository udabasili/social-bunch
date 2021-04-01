const jwt = require('jsonwebtoken');
const models = require('../models')
const { ACCESS_TOKEN_SECRET_KEY, REFRESH_TOKEN_SECRET_KEY } = require('../config');
const { Types } = require('mongoose');


/**
 *
 * Generates the access token
 * @param {string} userId
 * @param {string} [issuer='localhost']
 * @return {string} accessToken
 */
exports.generateAccessToken = async(userId, issuer = 'localhost') => {
    try {
        const payload = {
            userId
        }
        const options = {
            expiresIn: '20m',
            issuer,
            audience: userId.toString()
        }

        const accessToken = await jwt.sign(payload, ACCESS_TOKEN_SECRET_KEY, options)
        return accessToken;
    } catch (error) {
        throw (error)
    }
}


/**
 *
 * Generates the refresh token
 * @param {string} userId
 * @param {string} [issuer='localhost']
 * @return {string} accessToken
 */
exports.generateRefreshToken = async(userId, issuer='localhost') => {
    let date= new Date()
    date.setDate(date.getDate() + 14)
    try {
        const payload = {
            userId
        }
        const options = {
            expiresIn: '14d',
            issuer,
            audience: userId.toString()
        }

        const refreshToken = await jwt.sign(payload, REFRESH_TOKEN_SECRET_KEY, options)
        const doc = await models.UserModel.findOne({
             _id: Types.ObjectId(userId)
         })
        doc.refreshToken = refreshToken
        doc.refreshTokenExpiration = date
        await doc.save()
        return refreshToken;
    } catch (error) {
        throw (error)
    }
}

exports.verifyRefreshToken = async (refreshToken) =>{
    try {
        const currentDate = Date.now()
        if(!refreshToken){
           throw false;
        }
        const payload = await jwt.verify(refreshToken, REFRESH_TOKEN_SECRET_KEY)
        const response = await models.UserModel.findOne({
            _id: Types.ObjectId(payload.userId),
            refreshToken,
            refreshTokenExpiration:{
                $gte : currentDate
            }
        })
        .select('-email -password -refreshTokenExpiration -refreshToken')
        .populate('friends', ['username', 'userImage'])
        if(!response){
            throw false;
        }
        return response

    } catch (error) {
        return false
    }
}


