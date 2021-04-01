const { format, transports, config, createLogger } = require('winston');
const { combine, timestamp, printf, label } = format;

const myFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} | ${label} | ${level.toUpperCase()}  | ${message} | `
});
 
const transportsArray = [];

if (process.env.NODE_ENV !== 'development') {
    transportsArray.push(
        new transports.Console()
    )
} else {
    transportsArray.push(
        new transports.Console({
            format: combine(
                format.cli(),
                format.splat(),
            )
        })
    )
}

const Logger = createLogger({
    level: 'silly',
    levels: config.npm.levels,
    format: combine(
        label({
            label: 'Social Bunch Server'
        }),
        format.splat(),
        format.errors({
            stack: true
        }),
        timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        myFormat
    ),
    transports: transportsArray
});
 

module.exports = Logger;
