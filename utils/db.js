const mongoose = require("mongoose");
mongoose.Promise = Promise;
require("dotenv").config
mongoose.set("debug", true)
if (process.env.NODE_ENV === 'production') {
    mongoose.connect(process.env.MONGODB_URI, { 
    useFindAndModify: true, useNewUrlParser: true , useUnifiedTopology: true})
}
else{
    mongoose.connect("mongodb://localhost/simple-chat", { 
    useFindAndModify: true, useNewUrlParser: true , useUnifiedTopology: true})
}
const db = mongoose.connection;
module.exports = db ;

