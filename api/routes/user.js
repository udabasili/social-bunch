const express = require('express')
const route = express.Router({mergeParams: true})
const services = require('../../services')
const config = require('../../config');
const Client = require('@googlemaps/google-maps-services-js').Client;
const client = new Client({});

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

route.get('/add-friend/:addedUserId', async function(req, res, next){
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


route.post('/get-location', async (req, res, next) => {    
    const api = config.googleApi;
    let lat  = req.body.lat
    let long = req.body.long
    client.reverseGeocode({
        params: {
            latlng: [lat, long],
            key: api
          },
          timeout: 1000 // milliseconds
        })
        .then(response => {            
            if(response.status === 200 ){
                let location  = response.data.results[5].formatted_address
                return  res.status(200).json({
                    status:200,
                    message: location
                })
            }
            else{                
                throw new Error('Location not found')
            }
        })
        .catch((err)=>{
            return next(err)
            }
        )
    }
)
    
    
module.exports = route