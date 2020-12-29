const express = require('express')
const route = express.Router({mergeParams: true})
const services = require('../../services')


route.post('/profile/edit', async function(req, res, next){
    try{
        const editedUserData = req.body;        
        const UserService = new services.UserService(editedUserData, req.params.userId)
        const currentUser = await UserService.editUser()
        req.currentUser = currentUser;
        return res.status(200).json({
            status:200,
            message:currentUser
        })
    }  
    catch (error) {
        return next(error)
    }     
})


route.get('/profile/:Id', async function (req, res, next) {
    try {
        
        const result = await services.UserService.getUserData(req.params.Id) 
        console.log(result)
        return res.status(200).json({
            status: 200,
            message: result
        })
    }
    catch (error) {
        return (next)

    }
})

route.post('/add-friend/:addedUserId', async function(req, res, next){
    try {
        const UserService = new services.UserService(
            req.currentUser, 
            req.params.userId, 
            req.params.addedUserId
        )
        const {currentUser, filteredOtherUserData} = await UserService.addFriend();
        return res.status(200).json({
            status:200,
            message:{
                currentUser,
                otherUser: filteredOtherUserData
            }
        })
    } 
    catch (error) {        
        return (next)
        
    }
})

route.post('/remove-friend/:removedFriendId', async function (req, res, next) {
    try {
        const UserService = new services.UserService(
            req.currentUser,
            req.params.userId,
            req.params.removedFriendId
        )
        const { currentUser, filteredOtherUserData } = await UserService.removeFriends();
        return res.status(200).json({
            status: 200,
            message: {
                currentUser,
                otherUser: filteredOtherUserData
            }
        })
    }
    catch (error) {
        return (next)

    }
})

    
module.exports = route