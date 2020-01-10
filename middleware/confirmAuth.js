const jwt = require("jsonwebtoken");
const User = require("../model/user");
const mongoose = require("mongoose");

//confirm token is correct
exports.confirmAuthentication = async (req, res, next) =>{
    try {
        console.log((req.headers['authorization']).split(" ")[1])
        let token = (req.headers['authorization']).split(" ")[1];
        if (!token) {
            return next({
                status:401,
                message:"unAuthorized User"
                });
            }
        jwt.verify(token, process.env.SECRET_KEY, function(err, user) {
        if (err){
            return res.next({
                status:401,
                message:"unAuthorized User"
            })
        }
        
        return User.findOne({
            username: user.username
            })
            .then((user)=>{
                if (user) {
                    const filteredData = user.filterUserData()

                    return res.status(200).json({
                        status:200,
                        message:'success',
                        token:token,
                        user:filteredData
                    })   
                } 
                else {
                    return next({
                        status:401,
                        message:"unAuthorized User"
                    })
                }
            })
            }
        )
    } catch (error) {
        
         return next({
            status:401,
            message:error.message
        })
    }
    
}
// check token before giving access to account 
exports.protectedRoute = function(req, res, next){
    try{
        console.log((req.headers['authorization']).split(" ")[1])

        let token = (req.headers['authorization']).split(" ")[1];
        
        if (!token) {
            return res.status(401).json({message: 'Must pass token'});
        }
        jwt.verify(token, process.env.SECRET_KEY, function(err, user) {
            console.log(err);
            
            if (err ){            
                return next({
                    status:401,
                    message:"unAuthorized User"
                })
            }               
            return User.findOne({
                username: user.username
                })
                .then((user) =>{
                    //check if user exists in database
                    if( user.length === 0 ){
                        return next({
                            status:401,
                            message:"unAuthorized User"
                        })
                    }
                    else{
                        const filteredData = user.filterUserData()
                        req.user = filteredData
                        
                        next()
                    }
                })
        })

    }
    catch(error){
        console.log(error);
        
        return next({
            status:401,
            message:"unAuthorized User"
        })
        
    }
    
}

// check if it is the right user

exports.confirmUser  = function(req, res, next){
    try {
        let token = (req.headers['authorization']).split(" ")[1];

    if (!token) {
        return res.status(401).json({message: 'Must pass token'});
    }
    jwt.verify(token, process.env.SECRET_KEY, function(err, user) {
        console.log("1");

        // check if token is valid or if user id decoded
        let decodedId = user._id;
        let paramsId =  req.params.userId;
        console.log(user._id === req.params.userId );
        
        if (user && decodedId === paramsId){            
            return next();
        }               
        else {
            return  next({
                        status:401,
                        message:"unAuthorized User"
                    })
                }
            })
        }

        catch(error){
        console.log(error);
        
        return next({
            status:401,
            message:"unAuthorized User"
            })
        
        }
    }