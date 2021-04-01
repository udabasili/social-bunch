const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const messageSchema = new Schema(
    {
        text:{
            type:String,
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        chatId:{
            type: String
        },
        status:{
            type: String,
            default: 'delivered'
        },
        read:{
            type:Boolean,
            default: false
        }
    },
    {
        timestamps:true
    })


module.exports = mongoose.model('Message', messageSchema)