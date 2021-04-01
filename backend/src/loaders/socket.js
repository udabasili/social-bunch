const Logger = require("./logger")
const services = require('../services')
let io = null;

exports.startIO = function (server) {
    Logger.info('Socket listener started')
    io = require('socket.io')(server, {
        path: '/socket.io'
    })
    io.on('connect', function (socket) {
        Logger.info(`${socket.id} has connected`)
        services.ChatService.setUserSocket(socket, io)
        services.ChatService.messageListener(socket, io)
        socket.on('disconnect', function () {
            services.ChatService.disconnect(socket, io);
        });
    })
}

exports.getIO = function (socket){
     if(!io){
        Logger.error('Io not initialized')
    }
    return io
}

exports.getSocket = function (socket) {
    if (!io) {
        Logger.error('Io not initialized')
    }
    return io
}