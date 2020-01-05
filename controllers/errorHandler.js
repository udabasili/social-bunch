 function errorHandler (error, req, res, next){
    return res.status(error.status || 500).json({
        error:{
            message: error.message 
        }
        
    })
}

module.exports = errorHandler;