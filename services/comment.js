const config = require("../config");
const Models = require("../models");
const logger = require("../loaders/logger");
const mongoose = require("mongoose");

class CommentService{


    static async addReplyToComment(reply, postId, commentId, userId){
    //update comment where id is comment id
    let replyObject = {
         author: userId ,
        comment:reply,
        createdOn: Date.now()
    }

    const query = {_id: mongoose.Types.ObjectId(postId) , 'comments._id':  mongoose.Types.ObjectId(commentId) }
    const update = {
        $push: {
            'comments.$.replies': {...replyObject}
        }
    }
    await Models.Post.updateOne(query,update)
    const posts = await Models.Post.find()
        .sort({
            createdAt: 'desc'
        })
        .populate('user', {
            username: true,
            userImage: true,
        })
        .populate('comments.replies.author', ['username', 'userImage'])

        return posts
    }

    static async deleteComment(postId, commentId){
        const query = {_id: mongoose.Types.ObjectId(postId), 'comments._id':  mongoose.Types.ObjectId(commentId)  }
        const update = {
            $pull: {
            'comments': {
                '_id': mongoose.Types.ObjectId(commentId)
                } 
            }
        }
         await Models.Post.updateOne(query, update)
        const posts = await Models.Post.find()
            .sort({
                createdAt: 'desc'
            })
            .populate('user', {
                username: true,
                userImage: true,

            })
            .populate('comments.replies.author', ['username', 'userImage'])
            console.log(posts.length)
        return posts
    }

    static async updateComment(commentId, postId, comment){
        console.log(comment.authorImage, comment.authorName, comment.comment, "fff")
        const query = {_id: mongoose.Types.ObjectId(postId), 'comments._id':  mongoose.Types.ObjectId(commentId)  }
        const update = {
            $set:{
                'comments.$.authorName': comment.authorName,
                'comments.$.authorImage' : comment.authorImage,
                'comments.$.comment' : comment.comment,
            }
        }
        await Models.Post.updateOne(query, update)
        const posts = await Models.Post.find()
            .sort({
                createdAt: 'desc'
            })
            .populate('user', {
                username: true,
                userImage: true,
            }).populate('comments.replies.author', ['username', 'userImage'])
        return posts
    }
a
 

    static async addLikeToComment(likedBy, postId, commentId) {
        console.log(likedBy, postId, commentId)
        const query = {'_id': mongoose.Types.ObjectId(postId), 'comments._id': mongoose.Types.ObjectId(commentId)}
        const update = {
            $push: {
               'comments.$.likes': likedBy
            }
        }
        await Models.Post.updateOne(query,update)
        const posts = await Models.Post.find()
            .sort({
                'createdAt': -1
            })
            .populate('user', {
                username: true,
                userImage: true,

            }).populate('comments.replies.author', ['username', 'userImage'])
        return posts
    }

    static async removeLikeFromComment(likedBy, postId, commentId) {
        console.log(likedBy, postId, commentId)
        const query = {'_id': mongoose.Types.ObjectId(postId), 'comments._id': mongoose.Types.ObjectId(commentId)}
        const update = {
            $pull: {
               'comments.$.likes': likedBy
            }
        }
        await Models.Post.updateOne(query,update)
        const posts = await Models.Post.find()
            .sort({
                'createdAt': -1
            })
            .populate('user', {
                username: true,
                userImage: true,

            }).populate('comments.replies.author', ['username', 'userImage'])
        return posts
    }

    
}

module.exports = CommentService