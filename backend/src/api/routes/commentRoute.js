const express = require('express')
const router = express.Router({mergeParams: true});
const { CommentService } = require('../../services');
const io = require("../../loaders/socket");

router.post("/posts/:postId/comment/:commentId/add-reply",
	async function (req, res, next) {
        const reply = req.body.reply
        const postId = req.params.postId
        const commentId = req.params.commentId
        const userId = req.params.userId
		try {
			const posts = await CommentService.addReplyToComment(reply, postId, commentId, userId);
			io.getIO().emit('posts', {
				action: 'updatedPosts',
				payload: posts
			})
			return res.status(200).json({
				status: 200,
				message: posts
			});
		} catch (error) {
			return next(error);
		}
	}
);

router.put("/posts/:postId/comment/:commentId/like", async function (req, res, next) {
	try {
		const likedBy = req.body.likedBy
		const postId = req.params.postId
		const commentId =  req.params.commentId
		const posts = await CommentService.addLikeToComment(likedBy, postId, commentId )
		io.getIO().emit('posts', {
		action: 'updatedPosts',
		payload: posts
		})

		return res.status(200).json({
			status: 200,
			message: posts
		});
	} catch (error) {
		return next(error)
	}
})


router.put("/posts/:postId/comment/:commentId/unlike", async function (req, res, next) {
	try {
		const likedBy = req.body.likedBy
		const postId = req.params.postId
		const commentId =  req.params.commentId
		const posts = await CommentService.removeLikeFromComment(likedBy, postId, commentId )
		io.getIO().emit('posts', {
		action: 'updatedPosts',
		payload: posts
		})
		
		return res.status(200).json({
			status: 200,
			message: posts
		});
	} catch (error) {
		return next(error)
	}
})


router.put("/posts/:postId/comment/:commentId/like", async function (req, res, next) {
	try {
		const likedBy = req.body.likedBy
		const postId = req.params.postId
		const commentId =  req.params.commentId
		const posts = await CommentService.addLikeToComment(likedBy, postId, commentId )
		io.getIO().emit('posts', {
		  action: 'updatedPosts',
		  payload: posts
		})

		return res.status(200).json({
			status: 200,
			message: posts
		})
	} catch (error) {
		return next(error)
	}
})


router.post("/posts/:postId/comment/:commentId/edit", async function (req, res, next) {
	try {
		const comment = req.body.comment
		const postId = req.params.postId
		const commentId =  req.params.commentId
		const user = req.currentUser
		const posts = await CommentService.updateComment(
			commentId, 
			postId, 
			comment, 
			user
		)
		io.getIO().emit('posts', {
		  action: 'updatedPosts',
		  payload: posts
		})
		
		return res.status(200).json({
			status: 200,
			message: posts
		})
	} catch (error) {
		return next(error)
	}
})


router.delete("/posts/:postId/comments/:commentId/remove", async function (req, res, next) {
	try {
		const postId = req.params.postId
		const commentId =  req.params.commentId
		const posts = await CommentService.deleteComment(postId, commentId)
		io.getIO().emit('posts', {
		action: 'updatedPosts',
		payload: posts
		})

		return res.status(200).json({
			status: 200,
			message: posts
		})
	} catch (error) {
		return next(error)
	}
})
module.exports = router