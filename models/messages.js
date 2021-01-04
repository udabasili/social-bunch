const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema(
    {
        text:{
            type:String,
        },
        createdBy:{
            type:String,
        },
        chatId:{
            type: String
        },
        location:{
            type:String
        },
        image:{
            type:String,

        },
        document:{
            type: String
        },
        status:{
            type: String,
            default: 'delivered'
        }
    },
    {
        timestamps:true
    })


module.exports = mongoose.model('Message', messageSchema)