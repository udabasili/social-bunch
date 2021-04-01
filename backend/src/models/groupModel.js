const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserModel = require('./userModel')
const groupSchema = new Schema({
    groupName:{
        type: String,
        required: true
    },
    category:{
        type:String,
        required:true
    },
    description: {
        type: String,
        required: true,
    },
    imageUrl:{
        type: String,
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }]
    
    },
    {
        timestamps:true
})

groupSchema.pre('remove', async function(next){
    const creator = this.createdBy
    const filter = {
        _id: mongoose.Types.ObjectId(creator)
    }

    const query = {
        $pull:{
            posts: this._id
        }
    }
    await UserModel.updateOne(filter, query)
    next()
})

module.exports = mongoose.model('Group', groupSchema)