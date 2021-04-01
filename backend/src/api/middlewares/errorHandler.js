const Logger = require("../../loaders/logger")

function errorHandler (error, req, res, next){
    console.log(error.stack)
    return res.status(error.status || 500).json({
        code: error.code || 'ERROR',
        message: error.message,
    })
}

module.exports = errorHandler