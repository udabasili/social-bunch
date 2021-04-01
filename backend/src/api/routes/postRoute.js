const express = require('express');
const Logger = require('../../loaders/logger');
const route = express.Router({
    mergeParams: true
})
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const service = require('../../services');
const io = require('../../loaders/socket');

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: (req, file) => `posts/${req.params.userId}`,
        public_id: (req, file) => {
            return file.originalname.split('.')[0]
        },
    },

});

const upload = multer({
    storage: storage,
})

const cpUpload = upload.fields(
    [
        {
            name: 'images',
            maxCount: 10
        }, {
            name: 'text',
            maxCount: 2
        }
])

route.post(
    "/posts/create-post/:type",
    async function (req, res, next) {
        try {
            const type = req.params.type
            const posts = await service.PostService.addPost(req.body, req.currentUser._id, type);
            io.getIO().emit('posts', {
                action: 'new Posts Created',
                payload: posts
            })
            return res.status(200).end()
        } catch (error) {
            return next(error);
        }
    }
)


route.post(
    "/posts/create-image-post",
    cpUpload,
    async function (req, res, next) {
        try {
            const images = req.files.images
            const message = req.body.text
            const posts = await service.PostService.addImagePost(images, req.currentUser._id, message);
             io.getIO().emit('posts', {
                 action: 'new Posts Created',
                 payload: posts
             })
            return res.status(200).end()
        } catch (error) {
            return next(error);
        }
    }
)

route.put("/posts/:postId/like", async function (req, res, next) {
    try {
        const userId = req.currentUser._id;
        const [posts, notifications] = await service.PostService.addLikeToPost(userId, req.params.postId)
        io.getIO().emit('notifications', {
            action: 'newNotification',
            updateNotification: notifications
        })
        io.getIO().emit('posts', {
            action: 'new Posts Created',
            payload: posts
        })
        return res.status(200).end()
    } catch (error) {
        return next(error)
    }
})


route.get("/posts", async function (req, res, next) {
    try {
        const pageNumber = req.query.page;
        const posts = await service.PostService.getPosts(pageNumber)
        return res.status(200).json({
            status: 200,
            message: posts
        });
    } catch (error) {
        return next(error)
    }
})

route.delete(
    "/posts/:postId/delete",
    async function (req, res, next) {
        try {
            const posts = await service.PostService.deletePost(req.params.postId);
            io.getIO().emit('posts', {
                action: 'Deleted Post',
                payload: posts
            })
            return res.status(200).end()
        } catch (error) {
            return next(error);
        }
    }
);

route.post("/posts/:postId/comment/add", async function (req, res, next) {
    try {
        const {
            notifications,
            posts
        } = await service.PostService.addCommentToPost(req.body, req.params.postId)
        io.getIO().emit('notifications', {
            action: 'newNotification',
            updateNotification: notifications
        })
        io.getIO().emit('posts', {
            action: 'Comment Added',
            payload: posts
        })
        return res.status(200).end()
    } catch (error) {
        return next(error)
    }
})

route.put(
    "/posts/:postId/edit/:type",
    async function (req, res, next) {
        try {
            const type = req.params.type
            const posts = await service.PostService.updatePost(req.body, req.params.postId, type);
            io.getIO().emit('posts', {
                action: 'Edited Post',
                payload: posts
            })
            return res.status(200).end()
        } catch (error) {
            return next(error);
        }
    }
);

module.exports = route