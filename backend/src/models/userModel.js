const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    socketId: {
        type: String,
        default: null
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        min: 8
    },
    userImage: {
        type: String,

    },
    bio: {
        type: String
    },
    refreshToken :{
        type: String
    },
    fullAuthenticated: {
        type: Boolean,
        default: true
    },
    nextRoute: {
        type: String
    },
    refreshTokenExpiration: {
        type: Date
    },
    dateOfBirth: {
        type: String
    },
    occupation: {
        type: String
    },
    location: {
        type: String
    },
    lastOnline: {
        type: Date,
        default: new Date()
    },
    notifications: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Notification'
    }],
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }],


}, {
    timestamps: true
})

userSchema.methods.encryptPassword = async function (req, res, next) {
    try {

        let hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword
    } catch (error) {
        return next(error)
    }

}

userSchema.methods.comparePassword = async function (userConfirmPassword) {
    let passwordCheck = await bcrypt.compare(userConfirmPassword, this.password)
    return passwordCheck;
}

userSchema.methods.filterData = function(){
    const data = this.toObject();
    delete data.password;
    delete data.refreshToken;
    delete data.refreshTokenExpiration;
    return data;
}

userSchema.methods.saveMessage = function (user, message, type) {
    try {
        let friends = [...this.friends]
        let friendIndex = friends.findIndex((friend) => (
            friend.userInfo.username === user.username
        ))
        if (friendIndex !== -1) {
            friends[friendIndex].messages.push(message)
        }
        this.friends = friends;
        return this.save()

    } catch (error) {}
}



const User = mongoose.model('User', userSchema )
module.exports = User;