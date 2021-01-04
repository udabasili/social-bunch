const config = require("../config");
const Models = require("../models");
const logger = require("../loaders/logger");

class PostService{


    static async addPost(newPost, userId){
        newPost = await Models.Post.create({
            text: newPost,
            user: userId
        })

        let creator = await Models.User.findByIdAndUpdate(userId, {
            $push:{
                post: newPost._id
            }
        })
        
        await Models.User.updateMany({ _id: { $ne : creator._id } } , {
            $push: {
                notifications: {
                    text:  `${creator.username} created a new post `,
                    
                }
            }
        })

        const posts = await this.getPosts()

        return posts
    }

    static async getPosts(){
    
        const posts = await Models.Post.find()
            .sort({createdAt: 'desc'})
            .populate('user',{
               username: true,
                userImage: true,
            }).populate('comments.replies.author', ['username', 'userImage'])

        return posts

    }

    static async deletePost(postId){
        await Models.Post.findByIdAndDelete(postId)
        const posts = await this.getPosts()
        return posts
    }

    static async updatePost(updatedPost, postId){
        await Models.Post.findByIdAndUpdate(postId, {text: updatedPost})
        const posts = await this.getPosts()
        return posts
    }
a
    static async addCommentToPost(comment, postId){
        let post = await Models.Post.findById(postId)
        let comments = [...post.comments]
        comments.push(comment)
        comments = comments.sort(function(a, b){ return b.createdOn - a.createdOn})
        post.comments = comments
        post = await post.save()
        const posts = await Models.Post.find()
            .sort({
                'createdAt': -1
            })
            .populate('user', {
                username: true,
                userImage: true,

            }).populate('comments.replies.author', ['username', 'userImage'])
        return {comments, posts}
    }

    static async addLikeToPost(likedBy, postId) {
        let post = await Models.Post.findById(postId)
        let likes = [...post.likes]
        likes.push(likedBy)
        post.likes = likes
        post = await post.save()
        likes = post.likes
        const posts = await Models.Post.find()
            .sort({
                createdAt: 'desc'
            })
            .populate('user', {
                username: true,
                userImage: true,
            }).populate('comments.replies.author', ['username', 'userImage'])
        return {
            likes,
            posts
        }
    }
}

module.exports = PostService