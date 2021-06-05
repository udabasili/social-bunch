import { toast } from "react-toastify";
import { f } from "../../services/firebase";
import { addNotification } from "../notification/notification.actions";
import { GET_POSTS } from "./post.actionType";

export const loadPosts = (posts) =>({
    type: GET_POSTS,
    payload: posts
})

const uploadEachPostImage = async (firebase, pictures, userId) => {
	const imageUrls = await Promise.all(pictures.map(picture =>
		new Promise((resolve, reject) => {
			const uploadTask = firebase.storage().ref().child(`posts/${userId}/${picture.name}`).put(picture)
			uploadTask.on('state_changed', (snapshot) => {
					const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
					console.log("Progress: ", progress)
				},
				reject,
				async () => {
					uploadTask.snapshot.ref.getDownloadURL()
						.then(url => {
							resolve(url);
						});
				});
		})
	));
	return imageUrls
}
 
export const addPost = (data, type) => {
	return (dispatch, getState, { getFirebase, getFirestore}) => {
		const firestore = getFirestore();
		const { user } = getState();
		const userId = user.currentUser._id
		let newPost;
		if (type === 'text') {
			newPost = {
				video: {
					title: null,
					link: null
				},
				text: data.text,
				user: userId,
				type,
				likes:[],
				createdAt: new Date(),
				updatedAt: new Date()
			}
		} else if (type === 'video') {
			newPost = {
				video: {
					title: data.title,
					link: data.link
				},
				user: userId,
				likes: [],
				type,
				createdAt: new Date(),
				updatedAt: new Date()
			}
		}
		return firestore.collection('posts').add({
			...newPost
		})
		.then(async (response) => {
            await firestore.collection('users').doc(userId).update({
                posts: f.firestore.FieldValue.arrayUnion(response.id)
            })
			toast.success('New Post Added')
			return response
		})
		.catch((err) => {
			toast.error(err.message)
			throw err.message
		});
	}
};

export const addImagePost = (files, title) => {
	return async (dispatch, getState, { getFirebase, getFirestore}) => {
		let imageUrls = [];
		const firebase = getFirebase();
        const firestore = getFirestore();
		const { user } = getState();
		const userId = user.currentUser._id
		imageUrls = await uploadEachPostImage(firebase, files, userId)
		let newPost = {
			user: userId,
			image: {
				title,
				images: imageUrls
			},
			type: 'image',
			likes: [],
			createdAt: new Date(),
			updatedAt: new Date()
		}
		return firestore.collection('posts').add({
			...newPost
		})
		.then( async (response) => {
            await firestore.collection('users').doc(userId).update({
                posts: f.firestore.FieldValue.arrayUnion(response.id)
            })			
			toast.success('New Post Added')
			return response
		})
		.catch((err) => {
			toast.error(err.message)
			throw err.message
		})
	}
};

export const editPost = (updatedPost, postId, type) => {
	return (dispatch, getState, {
		getFirebase,
		getFirestore
	}) => {
		const firestore = getFirestore();
		const {
			user
		} = getState();
		const userId = user.currentUser._id
		let post;
		if (type === 'text') {
			post = {
				text: updatedPost.text,
				user: userId,
				type,
				createdAt: new Date(),
				updatedAt: new Date()
			}
		} else if (type === 'video') {
			post = {
				video: {
					title: updatedPost.title,
					link: updatedPost.link
				},
				user: userId,
				type,
				createdAt: new Date(),
				updatedAt: new Date()
			}
		}
		return firestore.collection('posts').doc(postId).update({
				...post
			})
			.then((response) => {
				return response
			})
			.catch((err) => {
				toast.error(err.message)
				throw err.message
			});
	}
};

export const deletePost = (postId) => {
	return (dispatch, getState, { getFirebase, getFirestore }) => {
		const firestore = getFirestore();
        const { user } = getState();
		const userId = user.currentUser._id
		return firestore.collection('posts').doc(postId).delete()
		.then(async(response) => {
            await firestore.collection('users').doc(userId).update({
                posts: f.firestore.FieldValue.arrayRemove(postId)
            })
			return response
		})
		.catch((err) => {
			toast.error(err.message)
			throw err.message
		});
	}
};

export const addCommentToPost = (commentContent, postId, postOwner) => {
	return (dispatch, getState, { getFirebase, getFirestore }) => {
		const firestore = getFirestore();
        const { user } = getState();
		const currentUser = user.currentUser
		const commentRef = firestore.collection('comments');
		const postsRef = firestore.collection('posts').doc(postId);
		return commentRef.add({
			...commentContent,
			replies: [],
			likes: []
		})
		.then(async(response) => {
			const commentId = response.id;
			await postsRef.update({
				comments: f.firestore.FieldValue.arrayUnion(commentId)
			})
            if (currentUser.id !== postOwner) {
                await addNotification('liked', postId, postOwner, currentUser)
            }
            return response
		})
		.then((response) => {
			return response
		})
		.catch((err) => {
			toast.error(err.message)
			throw err.message
		});
	}
}

export const addLikeToPost = (likedBy, postId, postOwner) => {
  	return (dispatch, getState, { getFirebase, getFirestore }) => {
  		const firestore = getFirestore();
        const { user } = getState();
		const currentUser = user.currentUser;
  		const postsRef = firestore.collection('posts').doc(postId);
		return postsRef.update({
  			likes: f.firestore.FieldValue.arrayUnion(likedBy)
  		})
		.then(async(response) => {
            if (currentUser.id !== postOwner) {
                await addNotification('liked', postId, postOwner, currentUser)
            }
            return response
		})
		.catch((err) => {
			toast.error(err.message)
			throw err.message
		});
  	}
}

export const editCommentToPost = (comment, postId, commentId) => {
  	return (dispatch, getState, { getFirebase, getFirestore }) => {
		const firestore = getFirestore();
		const commentRef = firestore.collection('comments').doc(commentId);
		return commentRef.update({
			...comment,
		})
		.then((response) => {
			return response
		})
		.catch((err) => {
			toast.error(err.message)
			throw err.message
		});
	}
}

export const deleteComment = (postId, commentId) =>  {
	return (dispatch, getState, { getFirebase, getFirestore }) => {
		const firestore = getFirestore();
		const postsRef = firestore.collection('posts').doc(postId);
		const commentRef = firestore.collection('comments').doc(commentId);
		return postsRef.update({
			comments: f.firestore.FieldValue.arrayRemove(commentId)
		})
		.then(async (response) => {
			await commentRef.delete()
		})
		.catch((err) => {
			toast.error(err.message)
			throw err.message
		})
	}
}

export const addReplyToComment = (reply, postId, commentId) => {
	return (dispatch, getState, { getFirebase, getFirestore }) => {
		const { user } = getState();
		const firestore = getFirestore();
		const currentUser = user.currentUser
		let replyObject = {
			author: {
                _id: currentUser._id,
                username: currentUser.username,
                image: currentUser.image
            },
			comment: reply,
			createdOn: Date.now()
		}
		const commentRef = firestore.collection('comments').doc(commentId);
		return commentRef.update({
			replies: f.firestore.FieldValue.arrayUnion(replyObject)
		})
		.then((response) => {
			return response
		})
		.catch((err) => {
			toast.error(err.message)
			throw err.message
		})
	}
};


export const addLikeToComment = (likedBy, postId, commentId) =>  {
	return (dispatch, getState, { getFirebase, getFirestore }) => {
		const firestore = getFirestore();
		const commentRef = firestore.collection('comments').doc(commentId);
		return commentRef.update({
			likes: f.firestore.FieldValue.arrayUnion(likedBy)
		})
		.then((response) => {
			return response
		})
		.catch((err) => {
			toast.error(err.message)
			throw err.message
		})
	}
  
};

export const removeLikeFromComment = (likedBy, postId, commentId) => {
	return (dispatch, getState, { getFirebase, getFirestore }) => {
		const firestore = getFirestore();
		const commentRef = firestore.collection('comments').doc(commentId);
		return commentRef.update({
			likes: f.firestore.FieldValue.arrayRemove(likedBy)
		})
		.then((response) => {
			return response
		})
		.catch((err) => {
			toast.error(err.message)
			throw err.message
		})
	}
  
};