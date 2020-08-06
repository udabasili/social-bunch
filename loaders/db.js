const mongoose = require('mongoose');
const logger = require('../loaders/logger')
const config = require('../config')
const mongodbOptions = { 
  useFindAndModify: false, 
  useCreateIndex: true,
  useNewUrlParser: true , 
  useUnifiedTopology: true}
  
module.exports = function() {
  mongoose.Promise = Promise;
  if (process.env.NODE_ENV === 'production') {
    mongoose.connect(config.mongoDBProduction, mongodbOptions )
    .then(() => logger('info','Connected to mongodb'))
  }
  else{
      mongoose.connect(config.mongoDBDevelopment, mongodbOptions)
      .then(() => logger('info','Connected to mongodb'))
  }
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'Mongodb error'))
}



