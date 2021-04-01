const config = require("../config");
const models = require("../models");
const Logger = require("../loaders/logger");
const mongoose = require("mongoose");

class PostService{

    static async addPost(post, userId, type){
        let newPost;
        if(type === 'text'){
            newPost = await models.PostModel.create({
                text: post.text,
                user: userId,
                type
            })
        }else if (type === 'video') {
            newPost = await models.PostModel.create({
                video: {
                    title: post.title,
                    link: post.link
                },
                user: userId,
                type
            })
        }
        console.log(post.user, newPost._id)

        await models.UserModel.updateOne(
            {
                _id: mongoose.Types.ObjectId(userId)
            },
            {
                $push: {
                    posts: newPost._id
                }
            }
        )
    
        const posts = await this.getPosts()
        return posts
    }

    static async addImagePost(images, userId, title){
        let newPost = await models.PostModel.create({
            image: {
                title,
            },
            user: userId,
            type: 'image'
        })
        images.forEach((image) => {
            newPost.image.images.push(image.path)
        })
        await newPost.save()
        const posts = await this.getPosts()
        return posts
    }

    static async getPosts(){
    
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

    static async deletePost(postId){
        await models.PostModel.findByIdAndDelete(postId)
        const posts = await this.getPosts()
        return posts
    }

    static async updatePost(updatedPost, postId, type){
        console.log(updatedPost, postId, type)
        if (type === 'text') {
            await models.PostModel.findByIdAndUpdate(postId, {text: updatedPost.text})
        } else if (type === 'video') {
            await models.PostModel.findByIdAndUpdate(
                postId, 
                {
                    video: {
                        title: updatedPost.title,
                        link: updatedPost.link
                    },
                })
        }
        const posts = await this.getPosts()
        return posts
    }

    static async addCommentToPost(comment, postId){

        let post = await models.PostModel.findById(postId)
        let comments = [...post.comments]
        comments.push(comment)
        let notificationAbout = await models.UserModel.findOne({
            username: comment.authorName
        })
        let owner = await models.UserModel.findById(mongoose.Types.ObjectId(post.user))
        comments = comments.sort(function(a, b){ return b.createdOn - a.createdOn})
        post.comments = comments
        post = await post.save()
        const posts = await this.getPosts()
        let notification = await models.NotificationModel.create({
            type: 'commented',
            postId: post._id,
            owner: owner._id,
            notificationAbout: {
                userId: notificationAbout._id,
                username: notificationAbout.username,
                userImage: notificationAbout.userImage
            }
        })

        const filter = { _id: post.user }
        const query = {
            $push: {
                notifications: notification._id
            }
        }

        let creator = await models.UserModel.findOneAndUpdate(filter, query, {
                new: true
            })
            .select('-email -password -refreshToken -refreshTokenExpiration')
            .populate('notifications', [
                'type',
                'postId',
                'owner',
                'textRead',
                'notificationAbout',
                'createdAt'
            ])
        const notifications = creator.notifications
        return {notifications, posts}

    }

    static async addLikeToPost(likedBy, postId) {
        let post = await models.PostModel.findById(postId)
        let notificationAbout = await models.UserModel.findById(mongoose.Types.ObjectId(likedBy))
        let owner = await models.UserModel.findById(mongoose.Types.ObjectId(post.user))
        post.likes.push(likedBy)
        post = await post.save()
        const posts = await this.getPosts()
        let notification = await models.NotificationModel.create({
            type: 'liked',
            postId: post._id,
            owner: owner._id,
            notificationAbout: {
                userId: notificationAbout._id,
                username: notificationAbout.username,
                userImage: notificationAbout.userImage
            }
        })
        const filter= {_id: post.user}
        const query = {
            $push: {
                notifications: notification._id
            }
        }

        let creator = await models.UserModel.findOneAndUpdate(filter, query, {new: true})
                    .select('-email -password -refreshToken -refreshTokenExpiration')
                    .populate('notifications', [
                       'type',
                       'postId',
                       'owner',
                       'textRead',
                       'notificationAbout',
                       'createdAt'
                   ])     
        const notifications = creator.notifications
        return [posts, notifications]
    }
}

module.exports = PostService