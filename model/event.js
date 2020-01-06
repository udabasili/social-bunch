const mongoose = require("mongoose");
const User = require("./user")

const Schema = mongoose.Schema;
const eventSchema = new Schema({
    eventName:{
        type:String,
        required:true,
    },
    imageUrl:{
        type:String,
        required:true
    },
    summary:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        required:true,
    },
    time:{
        type:String
    },
    attenders:{
        type:Array
    },
    createdBy:{
        type:String,
    }
    },
    {
        timestamps:true
    })
eventSchema.methods.addAttender = async function(userId){
    let user = await User.findById(
        mongoose.Schema.Types.ObjectId(userId)
    )
    this.attenders.push(user.username)
    return this.save()
}

eventSchema.methods.removeAttender = async function(username){
    let attenders = [...this.attenders]
    attenders = attenders.filter((attender)=> attender !== username)
    this.attenders = attenders;
    return this.save()
}
module.exports = mongoose.model("Event", eventSchema)