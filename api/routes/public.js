const express = require('express');
const route = express.Router({mergeParams: true});
const Model = require('../../models');
const logger = require('../../loaders/logger')
const config = require('../../config');
const Client = require('@googlemaps/google-maps-services-js').Client;
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const client = new Client({});

route.post('/get-location', async (req, res, next) => {
    const api = config.googleApi;
    let lat = req.body.lat
    let long = req.body.long
    client.reverseGeocode({
        params: {
            latlng: [lat, long],
            key: api
        },
        timeout: 1000 // milliseconds
    })
        .then(response => {
            if (response.status === 200) {
                let location = response.data.results[5].formatted_address
                return res.status(200).json({
                    status: 200,
                    message: location
                })
            }
            else {
                throw new Error('Location not found')
            }
        })
        .catch((err) => {
            return next(err)
        }
        )
}
)

route.get('/events', async (req, res, next) =>{
    try {
        let events= await Model.Event.find({})
        logger('info', 'All Events gotten  from Event Model in database')
        return res.status(200).json({
            status:200,
            message:events
            })
        } 
     catch (error) {
        return next(error)
    }     
})

route.get('/groups', async (req, res, next)  => {
    try {
        const groups = await Model.Group.find();
        logger('info', 'All Groups gotten from Group Model in database')
        return res.status(200).json({
            status:200,
            message:groups
        })    
    } 
     catch (error) {
        return next(error)
    } 
})

route.get('/users', async function(req, res, next){
    try {
        let filteredData = await Model.User.find().select('_id username userImage')
        logger('info', 'All Users gotten from User Model in database')
        return res.status(200).json({
            status:200,
            message:filteredData
        })
    } catch (error) {
        return next(error)    
        }
    }
)


module.exports = route