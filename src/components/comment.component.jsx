import React from 'react'
import noImage from '../assets/images/no-image.png'
import { FaHeart } from "react-icons/fa";
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase'
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import {
    editCommentToPost,
    deleteComment,
    addLikeToComment,
    removeLikeFromComment
} from '../redux/posts/post.actions';
import {  populate } from 'react-redux-firebase'


const populates = [
	{
		child: 'likes',
		root: 'users'
	},
    {
        child: 'replies',
		root: 'users'
    }
]
function Comment({
    replies,
    comment,
    addLikeToComment,
    removeLikeFromComment,
    currentUser,
    setCommentId,
    deleteComment,
    scrollTop,
    postId,
    setComment
    }) {

    const datePrefix = (interval) =>{
        if (interval > 1){
            return "s ago"
        } else{
            return " ago"
        }
    }

    const deleteCommentHandler = (postId, commentId) => {
        deleteComment(postId, commentId)
    }

    const timeAgo = (date) => {
        let seconds = Math.abs(Math.floor((Date.now() - new Date(date)) / 1000))
        let interval = Math.floor(seconds / 31536000)
        if (interval > 1) {
            return interval + ' year' + datePrefix(interval)
        }
        interval = Math.floor(seconds / 25920000)
        if (interval > 1) {
            return interval + ' month' + datePrefix(interval)
        }
        interval = Math.floor(seconds / 86400)
        if (interval > 1) {
            return interval + ' day' + datePrefix(interval)
        }

        interval = Math.floor(seconds / 3600)
        if (interval > 1) {
            return interval + ' hour' + datePrefix(interval)
        }

        interval = Math.floor(seconds / 60)
        if (interval > 1) {
            return interval + ' minute' + datePrefix(interval)
        }
        return Math.floor(seconds) + ' second' + datePrefix(seconds)
    }


    const addLikeToCommentHandler = (commentId) => {
        const likedBy = currentUser._id;
        addLikeToComment(likedBy, postId, commentId).then(() =>
            toast.success('Comment liked')
        )
    }

    function editCommentToPostHandler(commentId, text) {
        scrollTop.current.scrollIntoView()
        setCommentId(commentId)
        setComment(`Edit:: ${text}`)
    }


    const replyToComment = (username, commentId) => {
        scrollTop.current.scrollIntoView()
        setComment(`@${username}: `)
        setCommentId(commentId)
    }

    return (
        comment ? (
            <li key={comment._id} className="comment__item">
                <img
                    src={comment.authorImage ? comment.authorImage : noImage}
                    alt={`${comment.authorName}`}
                    className="comment__photo"
                />
                <div className="comment__user">
                    <span className="username">{`@${comment.authorName}`}</span>
                    <span className="time">{timeAgo(comment.createdOn)}</span>
                    
                </div>
                <details  id={comment._id}>
                    <summary className = "comment__button" >
                        <span  className="comment__icon"></span>
                    </summary>
                    <ul className='comment__dropdown__list'>
                        <li className='comment__dropdown__item' 
                            onClick={() => editCommentToPostHandler(comment._id, comment.comment) } 
                            >Edit</li>
                        <li 
                            onClick={() => deleteCommentHandler(postId, comment._id)}
                            className='comment__dropdown__item'>Delete</li>
                    </ul>
                </details>
                
                <div className="comment__text">
                    {comment.comment}
                    {
                        comment.likes !== undefined && comment.likes.length > 0 && (
                            <div className="likes">
                                {comment.likes !== undefined && comment.likes.length} 
                                <FaHeart/>
                            </div>
                        )
                    }
                </div>
                    <div className="comment__options">
                        <div className="response" id={comment._id}>
                        {!comment.likes.includes(currentUser._id) ? (
                            <div
                                className="response__item"
                                style={{ color: "red", cursor: "pointer" }}
                                title='like'
                                onClick={() => addLikeToCommentHandler(comment._id)}
                            >
                                Like
                            </div>
                        ) : (
                            <div className="response__item" 
                                onClick={() => removeLikeFromComment(comment._id)}
                                style={{ color: "black" }} 
                                title='liked'>
                                    Unlike
                            </div>
                        )}
                        <div 
                            className="response__item" 
                            style={{ color: "black" }} 
                            onClick={() => replyToComment(comment.authorName, comment._id)}
                            title='liked'>
                                Reply
                        </div>
                    </div>
                </div>
                { replies !== undefined && replies.length > 0 && (
                    <details className="replies__detail">
                        <summary className="replies__summary" > 
                            Comments
                        </summary>
                            <ul className='replies__list' id={comment._id}>
                                { replies.sort((a, b) =>(
                                    new Date(b.createdOn) - new Date(a.createdOn) 
                                ))
                                .map((reply, index) => (
                                    <li key={`${reply.author._id}-${index}-`} className="comment__item">
                                        <img
                                            src={reply.author.image ? reply.author.image : noImage}
                                            alt={`${reply.author.username}`}
                                            className="comment__photo"
                                        />
                                        <div className="comment__user">
                                            <span className="username">{`@${reply.author.username}`}</span>
                                            <span className="time">{timeAgo(reply.createdOn)}</span>  
                                        </div>
                                        <p className="comment__text">
                                            {reply.comment}
                                            
                                        </p>
                                    </li>
                                ))
                            }
                        </ul>
                    </details>
                )}
            </li> ) :
            <div></div>
    )
}

Comment.propTypes = {
    commentList: PropTypes.array,
    setShowModal: PropTypes.func,
    currentUser: PropTypes.object,
    postId: PropTypes.string,
    deleteComment: PropTypes.func,
    editCommentToPost: PropTypes.func,
    addLikeToComment: PropTypes.func,
    removeLikeFromComment: PropTypes.func,
    addReplyToComment: PropTypes.func
}

const mapStateToProps = (state, ownProps) => {
    const id = ownProps.id;
    const comments = state.firestore.data.comments;
    let response = populate(state.firestore, 'comments', populates);
    console.log(response)
    let comment ;
    let replies = [];
    if (comments) {
        for (let key in comments) {
            comment =  ({
                _id: key,
                ...comments[id]
            })
             
        }
        if (comment.replies && comment.replies.length > 0) {
            replies = [...comment.replies]
        }
    }else {
        comment = null
    }
    
    return {
    currentUser: state.user.currentUser,
    comment,
    replies
}}

const mapDispatchToProps = {
    deleteComment,
    editCommentToPost,
    addLikeToComment,
    removeLikeFromComment
}

export default compose(
	firestoreConnect((props) => [
		 {
			collection: 'comments',
            populates
		 }
	 ]),
	connect(mapStateToProps, mapDispatchToProps)
)(Comment);
