const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
    eventName:{
        type:String,
        required:true,
    },
    description:{
        type: String
    },
    date:{
        type: Date,
        required:true,
    },
    time:{
        type: String
    },
    category:{
        type:String

    },
    attenders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        }
    },
    {
        timestamps:true
    }
)


module.exports = mongoose.model('Event', eventSchema)