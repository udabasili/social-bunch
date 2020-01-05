const jwt = require("jsonwebtoken");
const User = require("../model/user");

exports.confirmAuthentication = async (req, res, next) =>{
    try {
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

exports.protectedRoute = function(req, res, next){
    
    let token = (req.headers['authorization']).split(" ")[1];
    if (!token) {
        return res.status(401).json({message: 'Must pass token'});
    }
    jwt.verify(token, process.env.SECRET_KEY, function(err, user) {
        if (err){
            return next({
                status:401,
                message:"unAuthorized User"
            })
        }               
        return User.findOne({
            username: user.username
        })
            .then((user) =>{
                //check if user exists from token and is logged in
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