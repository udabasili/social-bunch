const models = require("../models");
const mongoose = require("mongoose");
const config = require("../config");
const Logger = require("../loaders/logger");


class CommentService{

    static async getPosts() {

        const posts = await models.PostModel.find()
            .sort({
                createdAt: 'desc'
            })
            .populate('user', {
                username: true,
                userImage: true,
            })
            .populate('likes', ['username', 'userImage'])
            .populate('comments.replies.author', ['username', 'userImage'])
        return posts

    }

    static async addReplyToComment(reply, postId, commentId, userId){
        let replyObject = {
            author: userId ,
            comment:reply,
            createdOn: Date.now()
        }

        const query = {
            _id: mongoose.Types.ObjectId(postId) , 
            'comments._id':  mongoose.Types.ObjectId(commentId) 
        }

        const update = {
            $push: {
                'comments.$.replies': {...replyObject}
            }
        }

        await models.PostModel.updateOne(query,update)
        const posts = await this.getPosts();
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
        await models.PostModel.updateOne(query, update)
        const posts = await this.getPosts();
        return posts
    }

    static async updateComment(commentId, postId, comment,user){
        console.log(commentId, postId, comment)
        const query = {_id: mongoose.Types.ObjectId(postId), 'comments._id':  mongoose.Types.ObjectId(commentId)  }
        const update = {
            $set:{
                'comments.$.authorName': user.username,
                'comments.$.authorImage' : user.userImage,
                'comments.$.comment' : comment,
            }
        }
        await models.PostModel.updateOne(query, update)
        const posts = await this.getPosts()
        return posts
    }
a
 

    static async addLikeToComment(likedBy, postId, commentId) {
        const query = {'_id': mongoose.Types.ObjectId(postId), 'comments._id': mongoose.Types.ObjectId(commentId)}
        const update = {
            $push: {
               'comments.$.likes': likedBy
            }
        }
        await models.PostModel.updateOne(query, update)
        const posts = await this.getPosts()
        return posts
    }

    static async removeLikeFromComment(likedBy, postId, commentId) {
        const query = {'_id': mongoose.Types.ObjectId(postId), 'comments._id': mongoose.Types.ObjectId(commentId)}
        const update = {
            $pull: {
               'comments.$.likes': likedBy
            }
        }
        await models.PostModel.updateOne(query, update)
        const posts = await this.getPosts()
        return posts
    }

    
}

module.exports = CommentService