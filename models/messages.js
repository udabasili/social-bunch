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

        location:{
            type:String
        }
    },
    {
        timestamps:true
    })


module.exports = mongoose.model('Message', messageSchema)