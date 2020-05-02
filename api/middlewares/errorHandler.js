const loggerFunction = require('../../loaders/logger');


/**
 * this handles formatting the error for both console \.log and the client 
 * @param{*} error
 * @param{*} req
 * @param{*} res
 * 
 * 
 */

function errorHandler (error, req, res, next){
    loggerFunction('error', error.message);
    return res.status(error.status||505).json({
        message: error.message || 'something went wrong'
    })
}

module.exports = errorHandler;
