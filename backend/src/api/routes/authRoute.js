const express = require('express');
const Logger = require('../../loaders/logger');
const route = express.Router({mergeParams: true})
const service = require('../../services');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const {
    CloudinaryStorage
} = require('multer-storage-cloudinary');
const io = require("../../loaders/socket");

const storage = new CloudinaryStorage({
	cloudinary: cloudinary,
    params: {
        folder: 'social-bunch',
        public_id: (req, file) =>{ 
            return file.originalname.split('.')[0]
        },
    },
	
});

const upload = multer({ 
	storage: storage,
		limits: {
			fileSize: 10 * 1024 * 1024,
	},
})


var cpUpload = upload.single('image')

route.post('/login', async function (req, res, next) {
    try {
        const User = new service.AuthService(req.body)
        const {
            currentUser,
            accessToken,
            refreshToken
        } = await User.SignIn();
        const users = await service.UsersService.getAllUsers()
        Logger.info(`${currentUser.username} has logged in`)
        res.cookie('x-refresh-token', refreshToken, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 14,
            secure: true
        });
        io.getIO().emit('set-socket', {
            userId: currentUser._id
        })
        io.getIO().emit('users', {
            action: 'updatedPosts',
            payload: users
        })
        return res.status(200).json({
            status: 200,
            message: {
                accessToken,
                currentUser,
                users
            }
        })
    } catch (error) {
         return next({
             status: 401,
             message: error.message,
             stack: error.stack
         })
    }
})


route.post('/register', async function (req, res, next) {
    try {
        const User = new service.AuthService(req.body)
        const newUser = await User.SignUp();
        Logger.info(`${newUser.username} has been created`)
        return res.status(200).json({
            status: 200,
            newUser
        })
    } catch (error) {
        if (error.code === 11000) {
            error.message = 'Sorry, this email/username is taken';
        }
        return next({
            status: 401,
            message: error.message,
            stack: error.stack
        })
    }
})

route.put('/:userId/avatar/add', function (req, res) {
    cpUpload(req, res, async function (err) {
        try {
            if (err instanceof multer.MulterError) {
                throw (err)
            } else if (err) {
                throw (err)
            }
            const userId = req.params.userId;
            io.getIO().emit('set-socket', {
                userId
            })
            const currentUser = await service.AuthService.uploadImage(userId, req.file.path)
            return res.status(200).json({
                status: 200,
                currentUser
            })
        } catch (error) {
            return next({
                status: 401,
                message: error.message,
                stack: error.stack
            })
        }
            
    })
})

route.put('/:userId/profile/add', async function (req, res, next) {
    try {
        const editedUserData = req.body;
        const UserService = new service.AuthService(editedUserData)

        const {
            updatedUser,
            accessToken,
            refreshToken
        } = await UserService.editUser(req.params.userId)
        const allUsers = await service.UsersService.getAllUsers()
        io.getIO().emit('users', {
            action: 'updatedPosts',
            payload: allUsers
        })
        res.cookie('x-refresh-token', refreshToken, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 14, // 24 HOURS,
            secure: true
        })
        return res.status(200).json({
            status: 200,
            message: {
                accessToken,
                currentUser: updatedUser,
                users: allUsers
            }
        })

    } catch (error) {
        return next(error)
    }
})

route.get('/logout', async (req, res, next) => {
    try {
        res.clearCookie('x-refresh-token')
        req.user = null
        const allUsers = await service.UsersService.getAllUsers()
        io.getIO().emit('users', {
            action: 'updatedPosts',
            payload: allUsers
        })
        return res.status(200).end()
    } catch (error) {

        return next({
            message: error.message,
            status: 500
        })
    }
})

module.exports = route