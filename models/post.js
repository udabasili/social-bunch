const mongoose = require("mongoose");
const User = require('./user')
const postSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      maxLength: 160,
    },
    comments:[{
      authorName: {
        type: String
      },
      authorImage: {
        type: String
      },
      comment:{
        type: String
      },
      createdOn:{
        type: Date
      },
      replies: [{
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
            },
            comment:{
                type: String
            },
            createdOn:{
                type: Date
            },         
        }],
      likes:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      }]

    }],
    likes:{
      type: Array
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

postSchema.pre('remove', async function(next){
    try {
        const user = await User.findById(this.user)
        user.posts.remove(this.id)
        await user.save()
        return next()

    } catch (error) {
        return next(error)
    }
})
const Post = mongoose.model("Post", postSchema);
module.exports = Post