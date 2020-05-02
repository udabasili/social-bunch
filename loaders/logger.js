const winston = require("winston")

dateFormat = () => {  return new Date(Date.now()).toUTCString()};

const logger = winston.createLogger({      
  transports: [        
    new winston.transports.Console(),        
    new winston.transports.File({          
      filename: `./logs/logger.log`        
    })      
  ],      
  format: winston.format.printf((info) => {        
    let message = `${dateFormat()} | ${info.level.toUpperCase()} | loggers.log | ${info.message} | `                     
    return message      
  })   

});

/**
 * create a custom logger function
 * @param {String} level 
 * @param {String} message 
 */
const loggerFunction = (level, message) => {
    logger.log({
      level,
      message
  })
}

  module.exports = loggerFunction;