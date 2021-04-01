const mongoose = require("mongoose");
const User = require('./userModel')

const notificationSchema = new mongoose.Schema({
    description: {
        type: String,
    },
    type: String,
    textRead: {
        type: Boolean,
        default: false
   },
   postId: mongoose.Schema.Types.ObjectId,
   owner: mongoose.Schema.Types.ObjectId,
   notificationAbout: {
       userId:mongoose.Schema.Types.ObjectId,
       username:String,
       userImage: String
   },
}, {
    timestamps: true
});


const Notification = mongoose.model("Notification", notificationSchema);
module.exports = Notification