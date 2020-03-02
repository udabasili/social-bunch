const jwt = require("jsonwebtoken");
const User = require("../model/user");

//confirm token is correct
exports.confirmAuthentication = async (req, res, next) =>{
    try {
        let token = (req.headers['authorization']).split(" ")[1];
        if (!token) {
            return next({
                status:401,
                message:"unAuthorized User"
                });
            }
        jwt.verify(token, process.env.SECRET_KEY, async function(err, user) {
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
                        message:{
                            validator:token,
                            currentUser:filteredData
                        }
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
        let token = (req.headers['authorization']).split(" ")[1];
        if (!token) {
            return res.status(401).json({message: 'Must pass token'});
        }
        jwt.verify(token, process.env.SECRET_KEY, async function(error, decoded){
            if (decoded) {
                next();
              } else {
                return next({ status: 401, message: "Please Log In First" });
              }   
            })     
        } catch (error) {            
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
    jwt.verify(token, process.env.SECRET_KEY, async function(err, decoded) {
        // check if token is valid or if user id decoded
        let decodedId = decoded._id;
        let paramsId =  req.params.userId;
        
        if (decoded && decodedId === paramsId){     
            let user = await User.findOne({
                username: decoded.username
            })       
            let filteredData = await user.filterUserData()
            req.user = filteredData ; 
            return next();
        }               
        else {
            return next({
                status:401,
                message:"unAuthorized User"
                })
            }
        })
    }
    catch(error){
        return next({
            status:401,
            message:"unAuthorized User"
            })
        }
    }