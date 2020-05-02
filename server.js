let server = require('./loaders/app');
const config = require('./config');
const loggerFunction = require('./loaders/logger')
var sockets = require('./loaders/socket');

const app = server.listen(config.port, function(){
    loggerFunction("info", `Serving is running on PORT ${config.port}`)

})

sockets.init(app)