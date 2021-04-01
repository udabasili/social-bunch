const { PORT } = require('./config');
const app = require('./loaders/app');
const Logger = require('./loaders/logger');
const db = require('./loaders/mongoose')
const socket = require('./loaders/socket')


db.on('error', console.error.bind(console, "Mongoose error raised"))
const server = app.listen(PORT, function(){
    Logger.info(`🛡️  Server listening on port: ${PORT} 🛡️`);
    db.once('open', function () {
        Logger.info("Database is running")
    })
    }).on('error', err => {
        Logger.error(err);
});

socket.startIO(server)
