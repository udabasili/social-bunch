// server.js

var AccessToken = require('twilio').jwt.AccessToken;
var VideoGrant = AccessToken.VideoGrant;

// Endpoint to generate access token
exports.getVideoToken = function(req, res, next) {
    try {        
        var room = req.body.room
        let identity = req.body.identity

// Create an access token which we will sign and return to the client,
// containing the grant we just created
var token = new AccessToken(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_API_KEY,
    process.env.TWILIO_API_SECRET
);

// Assign the generated identity to the token

   // Assign the generated identity to the token
   const grant = new VideoGrant({ room })
   // Grant token access to the Video API features
   token.addGrant(grant);
   token.identity = identity;


   // Serialize the token to a JWT string and include it in a JSON response
   return res.status(200).json({
       status:200,
       message:{
           token: token.toJwt()
       }
   });
        
    } catch (error) {
    
    }


 
}