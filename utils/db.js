const mongoose = require("mongoose");
mongoose.Promise = Promise;
require("dotenv").config
mongoose.set("debug", true)
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/simple-chat", { 
    useFindAndModify: true, useNewUrlParser: true , useUnifiedTopology: true})
const db = mongoose.connection;
module.exports = db ;

