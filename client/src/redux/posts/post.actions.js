import axios from "axios";
import { toast } from "react-toastify";
import { GET_POSTS } from "./post.actionType";

export const loadPosts = (posts) =>({
    type: GET_POSTS,
    payload: posts
})

export const addPost = (data, type) => (dispatch, getState) => {
	const { user } = getState();
	const id = user.currentUser._id
	return axios({
		url: `/api/user/${id}/posts/create-post/${type}`,
		method: 'POST',
		data,
		withCredentials: true
	})
	.then((response) => {
		toast.success('New Post Added')
		return response
	})
	.catch((err) => {
		toast.error(err.response.data.message)
		throw err.response.data.message
	});
};

export const addImagePost = (data) => (dispatch, getState) => {
	const {
		user
	} = getState();
	const id = user.currentUser._id
	return axios({
		url: `/api/user/${id}/posts/create-image-post`,
		method: 'POST',
		data,
		withCredentials: true,
		headers:{
			'content-type': 'multipart/form-data'
		}
	})
	.then((response) => {
		toast.success('New Post Added')
		return response
	})
	.catch((err) => {
		toast.error(err.response.data.message)
		throw err.response.data.message
	});
};

export const editPost = (updatedPost, postId, type) => (dispatch, getState) => {
	const { user } = getState();
	const id = user.currentUser._id
	return axios({
		url: `/api/user/${id}/posts/${postId}/edit/${type}`,
		method: 'PUT',
		data: updatedPost,
		withCredentials: true
	})
	.then((response) => {
		toast.success('Post Edited')
		return response
	})
	.catch((err) => {
		toast.error(err.response.data.message)
		throw err.response.data.message
	});
};

export const deletePost = (postId) => (dispatch, getState) => {
	const {user} = getState();
	const id = user.currentUser._id
	return axios({
		url: `/api/user/${id}/posts/${postId}/delete`,
		method: 'DELETE',
		withCredentials: true
	})
	.then((response) => {
		return response
	})
	.catch((err) => {
		toast.success('Post Deleted')
		toast.error(err.response.data.message)
		throw err.response.data.message
	});
};


export const getPosts = (pageNumber=1) => (dispatch, getState) => {
	const {user} = getState();
	const id = user.currentUser._id
   	return axios({
		url: `/api/user/${id}/posts?page=${pageNumber}`,
		method: 'GET',
		withCredentials: true
	})
	.then((response) => {
		dispatch(loadPosts(response.data.message || []));
	})
	.catch((err) => {
		toast.error(err.response.data.message)
		throw err.response.data.message
	});
};


export const addCommentToPost = (commentContent, postId) => (dispatch, getState) => {
  	const {
  		user
  	} = getState();
  	const id = user.currentUser._id
  	return axios({
		url: `/api/user/${id}/posts/${postId}/comment/add`,
		method: 'POST',
		data: commentContent,
		withCredentials: true
	})
	.then((response) => {
		return response
	})
	.catch((err) => {
		toast.error(err.response.data.message)
		throw err.response.data.message
	});
  
}

export const addLikeToPost = (likedBy, postId) => (dispatch, getState) => {
  	const {
  		user
  	} = getState();
  	const id = user.currentUser._id
  	return axios({
		url: `/api/user/${id}/posts/${postId}/like`,
		method: 'PUT',
		data: likedBy,
		withCredentials: true
	})
	.then((response) => {
		toast.success('Post Liked')
		return response
	})
	.catch((err) => {
		toast.error(err.response.data.message)
		throw err.response.data.message
	});
}

export const editCommentToPost = (comment, postId, commentId) => (dispatch, getState) => {
  	const {
  		user
  	} = getState();
  	const id = user.currentUser._id
  	return axios({
		url: `/api/user/${id}/posts/${postId}/comment/${commentId}/edit`,
		method: 'POST',
		data: comment,
		withCredentials: true
	})
	.then((response) => {
		dispatch(loadPosts(response.data.message));
	})
	.catch((err) => {
		toast.error(err.response.data.message)
		throw err.response.data.message
	});
}

export const deleteComment = (postId, commentId) => (dispatch, getState) => {
	const {
		user
	} = getState();
	const id = user.currentUser._id
	return axios({
		url: `/api/user/${id}/posts/${postId}/comments/${commentId}/remove`,
		method: 'DELETE',
		withCredentials: true
	})
	.then((response) => {
		dispatch(loadPosts(response.data.message));

	})
	.catch((err) => {
		toast.error(err.response.data.message)
		throw err.response.data.message
	})
}

export const addReplyToComment = (reply, postId, commentId) => (dispatch, getState) => {
	const {
		user
	} = getState();
	const id = user.currentUser._id
	return axios({
		url: `/api/user/${id}/posts/${postId}/comment/${commentId}/add-reply`,
		method: 'POST',
		data: {reply},
		withCredentials: true
	})
	.then((response) => {
		dispatch(loadPosts(response.data.message));

	})
	.catch((err) => {
		toast.error(err.response.data.message)
		throw err.response.data.message
	})
};


export const addLikeToComment = (likedBy, postId, commentId) => (dispatch, getState) => {
	const {
		user
	} = getState();
	const id = user.currentUser._id
	return axios({
		url: `/api/user/${id}/posts/${postId}/comment/${commentId}/like`,
		method: 'PUT',
		data: likedBy,
		withCredentials: true
	})
	.then((response) => {
		dispatch(loadPosts(response.data.message));

	})
	.catch((err) => {
		toast.error(err.response.data.message)
		throw err.response.data.message
	})
  
};

export const removeLikeFromComment = (likedBy, postId, commentId) => (dispatch, getState) => {
	const {
		user
	} = getState();
	const id = user.currentUser._id
	return axios({
		url: `/api/user/${id}/posts/${postId}/comment/${commentId}/unlike`,
		method: 'PUT',
		data: likedBy,
		withCredentials: true
	})
	.then((response) => {
		dispatch(loadPosts(response.data.message));

	})
	.catch((err) => {
		toast.error(err.response.data.message)
		throw err.response.data.message
	})
};

