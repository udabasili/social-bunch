const express = require('express')
const router = express.Router({mergeParams: true});
const { PostService } = require('../../services');
const io = require("../../loaders/socket");
const { getUserData } = require('../../services/user');
const { User } = require('../../models');

const broadcastToOnlineUsers = async () =>{
	const onlineUsers = await User.find({'socketId':{$ne: null}})
			.select('-email -password')
            .populate('friends', [ '_id' , 'username' , 'userImage'])
	onlineUsers.forEach(async user =>{
		io.getIo().to(user.socketId).emit('currentUser', {
			currentUser: user
		})
	})
}

router.post(
	"/posts/create-post",
	async function (req, res, next) {
		try {
		const posts = await PostService.addPost(req.body.text, req.params.userId);
		await broadcastToOnlineUsers()
		
		return res.status(200).json({
			status: 200,
			message: posts
		});
		} catch (error) {
		return next(error);
		}
	}
);

router.put(
	"/posts/:postId/edit",
	async function (req, res, next) {
		try {
		const posts = await PostService.updatePost(req.body.updatedPost, req.params.postId);
		io.getIo().emit('posts', {
			action: 'updatedPosts',
			updatedPost: posts
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

router.delete(
	"/posts/:postId/delete",
	async function (req, res, next) {
		try {
		const posts = await PostService.deletePost(req.params.postId);
		io.getIo().emit('posts', {
			action: 'updatedPosts',
			updatedPost: posts
		})
		const currentUser = await getUserData(req.params.userId)
		return res.status(200).json({
			status: 200,
			message: posts
		});
		} catch (error) {
		return next(error);
		}
	}
);

router.get("/posts",async function (req, res, next) {
	try {
		 const posts = await PostService.getPosts()
		 return res.status(200).json({
		   status: 200,
		   message: posts
		 });
	} catch (error) {
		return next(error)
	}
})

router.post("/posts/:postId/comment/add", async function (req, res, next) {
  try {
	const {
	  comments,
	  posts
	} = await PostService.addCommentToPost(req.body, req.params.postId)
	io.getIo().emit('posts', {
	  action: 'updatedPosts',
	  updatedPost: posts
	})
	
	return res.status(200).json({
	  status: 200,
	  message: comments
	});
  } catch (error) {
	return next(error)
  }
})


router.post("/posts/:postId/like", async function (req, res, next) {
  try {
	const {
	  likes,
	  posts
	} = await PostService.addLikeToPost(req.body.likedBy, req.params.postId)
	io.getIo().emit('posts', {
	  action: 'updatedPosts',
	  updatedPost: posts
	})
	const currentUser = await getUserData(req.params.userId)

	return res.status(200).json({
	  status: 200,
	  message: likes
	});
  } catch (error) {
	return next(error)
  }
})

module.exports = router