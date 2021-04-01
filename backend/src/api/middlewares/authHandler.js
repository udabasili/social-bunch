const jwt = require('jsonwebtoken');
const models = require('../../models');
const Logger = require('../../loaders/logger');
const expressJwt = require('express-jwt');
const mongoose = require("mongoose");
const { REFRESH_TOKEN_SECRET_KEY, ACCESS_TOKEN_SECRET_KEY } = require('../../config');
const { 
    generateAccessToken,
    verifyRefreshToken } = require('../../loaders/token');

/**
 * confirm the token user current has is valid fom the client end
 * /**
 * Attach user to req.currentUser
 * @param {*} req Express req Object
 * @param {*} res  Express res Object
 * @param {*} next  Express next Function
 */
 
const confirmAuthentication = async (req, res, next) =>{
    try {
        expressJwt({
            secret: REFRESH_TOKEN_SECRET_KEY,
            getToken: req => req.cookies,
            algorithms: ['HS256']
        })
        const refreshToken = req.cookies['x-refresh-token']
        let accessToken = req.headers['authorization'].split(' ')[1]
        if (!refreshToken || !accessToken) {
            return next({
                status:401,
                message:"unAuthorized User"
            })
        }
        const verified = await verifyRefreshToken(refreshToken)
        if (!verified) {
            return next({
                status: 401,
                message: "unAuthorized User"
            })
        }
        if (!verified) {
            return next({
                status:401,
                message:"unAuthorized User"
            })
        }
        accessToken = await generateAccessToken(verified._id, 'social-bunch')
        Logger.info('Verified User has valid token');
        return res.status(200).json({
            status:200,
            message:{
                accessToken,
                currentUser: verified
            }
        })     
    } 
    catch (error) { 
        return next({
            status:401,
            message:"unAuthorized User"
        })
    }
    
}

/**
 * confirm the token user current has is valid fom the client end
 * /**
 * Attach user to req.currentUser
 * @param {*} req Express req Object
 * @param {*} res  Express res Object
 * @param {*} next  Express next Function
 */

const protectedRoute = async function(req, res, next){
    try {
        expressJwt({
            secret: REFRESH_TOKEN_SECRET_KEY,
            getToken: req => req.cookies,
            algorithms: ['HS256']
        })
        const refreshToken = req.cookies['x-refresh-token']
        let accessToken = req.headers['authorization'].split(' ')[1]
        if (!refreshToken || !accessToken) {
            throw new Error("unAuthorized User")
        }
        await jwt.verify(accessToken, ACCESS_TOKEN_SECRET_KEY)  
        await jwt.verify(refreshToken, REFRESH_TOKEN_SECRET_KEY)
        return next()

    } 
    catch (error) {
        let code = 'INVALIDTOKEN'   
        if (error.message === 'jwt expired'){
            code = 'EXPIREDTOKEN'
        }   
        return next({
            code,
            status:401,
            message:"unAuthorized User"
    })
    }
        
}

/**
 * set the current user based on the use id passed fom the link
 * /**
 * Attach user to req.currentUser
 * @param {*} req Express req Object
 * @param {*} res  Express res Object
 * @param {*} next  Express next Function
 */

const setCurrentUser  = function(req, res, next){
    try {
        let accessToken = req.headers['authorization'].split(' ')[1]
        if (!accessToken) {
            return next({
                status:401,
                message:"unAuthorized User"
            })
        }
        jwt.verify(accessToken, ACCESS_TOKEN_SECRET_KEY, async function (err, decoded) {
            if (err) {
                throw new Error("unAuthorized User")
            }
            let decodedId = decoded.userId
            let paramsId =  req.params.userId;
            if (decoded && decodedId === paramsId){     
                const user = await models.UserModel.findOne({
                    _id: mongoose.Types.ObjectId(decoded.userId)
                })
                .select('-email -password -refreshToken -refreshTokenExpiration')
                .populate('friends', ['username', 'userImage'])
                req.currentUser = user ; 
                Logger.info( `User ${req.currentUser.username} communicated with the server`)
                return next();
            }               
            else {
                throw new Error("unAuthorized User")
            }
        })
    }
    catch(error){
        console.log(error)
        return next({
            status:401,
            message:"unAuthorized User"
            })
        }
    }

const refreshAccessToken = async function (req, res, next) {
    try {
        const userId = req.params.userId
        expressJwt({
            secret: REFRESH_TOKEN_SECRET_KEY,
            getToken: req => req.cookies,
            algorithms: ['HS256']
        })
        const refreshToken = req.cookies['x-refresh-token']
        let accessToken = req.headers['authorization'].split(' ')[1]
        if (!refreshToken || !accessToken) {
            throw new Error('"unAuthorized User"')
        }
        await jwt.verify(refreshToken, REFRESH_TOKEN_SECRET_KEY)
        accessToken = await generateAccessToken(userId, 'social-bunch')
        return res.status(200).json({
            status: 200,
            accessToken
        })
    } catch (error) {
        return next({
            status: 401,
            message: "unAuthorized User"
        })
        
    }
}

module.exports = {
    confirmAuthentication, 
    setCurrentUser, 
    protectedRoute,
    refreshAccessToken
}