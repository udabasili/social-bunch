const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const groupSchema = new Schema({
    name:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    createdBy:{
        type:String,
    },
    members:{
        type:Array
    } 
    
    },
    {
        timestamps:true
})

groupSchema.methods.removeMember = async function(username){
    let members = [...this.members]
    members = members.filter((member)=> member !== username)
    this.members = members;
    return this.save()
}
module.exports = mongoose.model("Group", groupSchema)