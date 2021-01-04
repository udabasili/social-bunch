import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faComment, faCheck } from '@fortawesome/free-solid-svg-icons';
import { connect } from 'react-redux'
import noImage from '../assets/images/no-image.png'
import { addCommentToPost,
  addLikeToPost, 
  deletePost, 
  removeLikeFromComment,
  addReplyToComment } from '../redux/action/post.actions';
import Comments from './comments.component';
import { toast } from 'react-toastify';

function Post({
  post,
  currentUser,
  addCommentToPost,
  addLikeToPost,
  editPostHandler,
  removeLikeFromComment,
  addReplyToComment,
  deletePost,
}) {
	const user = post.user;
	const [showModal, setShowModal] = useState(false);

	const datePrefix = (interval) =>{
		if (interval > 1){
		return "s ago"
		}else{
		return " ago"
		}
	}

	const prefix = (value, type) =>{
		if (value > 1){
		return `${value} ${type}s`
		}
		else{
		return `${value} ${type}`
		}
	}

	const timeAgo = (date) =>{
		let seconds = Math.floor((Date.now() - new Date(date))/ 1000)
		let interval = Math.floor(seconds / 31536000)
		if(interval > 1){
			return interval + ' year' + datePrefix(interval)
		}
		interval = Math.floor(seconds / 25920000)
		if(interval > 1){
			return interval + ' month' + datePrefix(interval)
		}
		interval = Math.floor(seconds / 86400)
		if(interval > 1){
			return interval + ' day' + datePrefix(interval)
		}

		interval = Math.floor(seconds / 3600)
		if(interval > 1){
			return interval + ' hour' + datePrefix(interval)
		}
		interval = Math.floor(seconds / 60)
		if(interval > 1){
			return interval + ' minute' + datePrefix(interval)
		}
		return Math.floor(seconds) + ' second' + datePrefix(seconds)
	}


	const addLike = () => {
		const likedBy = currentUser.username;
		addLikeToPost(likedBy, post._id).then(() =>
		toast.success('Post liked')
		);
	};

	

	const addReplyToCommentHandler = (commentId, reply) => {
		const likedBy = currentUser._id;
		addReplyToComment(reply, post._id, commentId).then(() =>
		toast.success('Reply sent')
		);
	};

	const removeLikeFromCommentHandler = (commentId) => {
		const likedBy = currentUser._id;
		removeLikeFromComment(likedBy, post._id, commentId).then(() =>
		toast.success('Comment Unliked')
		);
	};


	



	return (
		<div className="post" >
		<div className="post__user">
			<div className="user-icon">
			<div className="user-icon__photo-border">
				<img
				src={user.userImage ? user.userImage : noImage}
				alt="your profile"
				className="user-icon__photo"
				/>
			</div>
			</div>
			<div className="post__user-username">
			<span className="username">{`@${user.username}`}</span>
			<span className="time-ago" >{timeAgo(post.createdAt)}</span>
			</div>
		</div>
		<hr />
		<div className="post__message">{post.text}</div>
		<div className="post__options">
			<div className="post__status">
			<div className="likes">
				{post.likes !== undefined && post.likes.length > 0 &&
				prefix(post.likes.length, ' Like')
				}
			</div>
			<div 
				className="comments"
				onClick={() => setShowModal(true)}
				>
				{ post.comments !== undefined && post.comments.length > 0 &&
				`View ${prefix( post.comments.length, 'Comment')} `
				}
			</div>
			</div>
			{currentUser.username === user.username && (
			<div className="post__edit">
				<div className="edit" onClick={() => {
					editPostHandler(post)
				}}>
					Edit
				</div>
				<div className="delete" onClick={() => {
					deletePost(post._id)
					toast.success('Post deleted')
				}}>
					Delete
				</div>
			</div>
			)}
		</div>
		<hr />
		<div className="response">
			{!post.likes.includes(currentUser.username) ? (
			<div
				className="response__item"
				style={{ color: "red", cursor: "pointer" }}
				onClick={addLike}
				title='like'
			>
				<FontAwesomeIcon className="response__icon" icon={faThumbsUp} />
			</div>
			) : (
			<div className="response__item" style={{ color: "black" }} title='liked'>
				<FontAwesomeIcon className="response__icon" icon={faCheck}  />
				<p className="response__label" >Liked</p>
			</div>
			)}

			<div className="response__item" onClick={() => setShowModal(true)}>
			<FontAwesomeIcon className="response__icon" icon={faComment} />
			</div>
		</div>
		<hr />
		<div className="comment">
			<div className="comment__input-container">
			{(
				<div className="user-icon">
				<div className="user-icon__photo-border">
					<img
					src={
						currentUser.userImage
						? currentUser.userImage
						: noImage
					}
					alt="your profile"
					className="user-icon__photo"
					/>
				</div>
				</div>
			)}
			<input
				className="comment__input"
				onClick={() => setShowModal(true)}
				type="text"
				placeholder="Add Comment"
			/>
			</div>
				{showModal &&
				<Comments 
					postId={post._id} 
					commentList={post.comments} 
					addReplyToComment={addReplyToCommentHandler}
					removeLikeFromComment={removeLikeFromCommentHandler}
					addCommentToPost={addCommentToPost}
					setShowModal={setShowModal}/>
				}
		</div>
		</div>
	);
	}


const mapStateToProps = (state) => ({
	
})


const mapDispatchToProps = {
	addCommentToPost,
	addLikeToPost,
	addReplyToComment,
	deletePost,
	removeLikeFromComment
};

export default connect(mapStateToProps, mapDispatchToProps)(Post)