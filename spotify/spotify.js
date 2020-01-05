const express = require('express');
const router = express.Router();
require('dotenv').config();


const SpotifyWebApi = require('spotify-web-api-node');
let scopes = ['user-read-private', 'user-read-email','playlist-modify-public','playlist-modify-private']

const sApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: "http://localhost:3000",
});

router.get('/login', (req,res) => {
    try {
        var html = sApi.createAuthorizeURL(scopes)
  console.log(html)
  return res.send(html+"&show_dialog=true")  
    } catch (error) {
        console.log(error);
        
    }
  
})

router.get('/callback', async (req,res) => {
  try {
    sApi.clientCredentialsGrant().then(
  function(data) {
    console.log('The access token is ' + data.body['access_token']);
    sApi.setAccessToken(data.body['access_token']);
  },
  function(err) {
    console.log('Something went wrong!', err);
  }
);
    

    res.status(200).json({
        status:200,
        message:data.body['access_token'],
    })
  } catch(err) {
    res.redirect('/#/error/invalid token');
  }
});

module.exports = router;