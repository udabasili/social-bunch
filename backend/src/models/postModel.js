const mongoose = require("mongoose");
const User = require('./userModel')
const Notification = require('./notificationModel')

const postSchema = new mongoose.Schema({
    text: {
        type: String,
    },
    image: {
        title:{
            type: String,
        },
        images:[String]
    },
    video: {
        title:{
            type: String,
        },
        link:{
            type: String
        }
    },
    type:{
        type: String,
        required: true
    },
    comments: [{
        authorName: {
            type: String
        },
        authorImage: {
            type: String
        },
        comment: {
            type: String
        },
        createdOn: {
            type: Date
        },
        replies: [{
            author: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            comment: {
                type: String
            },
            createdOn: {
                type: Date
            },
        }],
        likes: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }]

    }],
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
}, {
    timestamps: true
});

postSchema.pre('remove', async function (next) {
    try {
        const user = await User.findById(this.user)
        user.posts.remove(this._id)
        await Notification.deleteMany({
            postId: mongoose.Types.ObjectId(this._id)
        })
        await user.save()
        return next()

    } catch (error) {
        return next(error)
    }
})

const Post = mongoose.model("Post", postSchema);
module.exports = Post