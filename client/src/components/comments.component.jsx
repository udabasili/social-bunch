import React, { useState , useRef} from 'react'
import noImage from '../assets/images/no-image.png'
import { toast } from 'react-toastify'
import { FaHeart } from "react-icons/fa";
import { connect } from 'react-redux'
import { 
    editCommentToPost , 
    deleteComment, 
    addLikeToComment
    } from '../redux/posts/post.actions';
import { AiFillCloseCircle } from 'react-icons/ai';
import PropTypes from 'prop-types';

function Comments({
        commentList, 
        setShowModal, 
        currentUser, 
        addCommentToPost, 
        postId , 
        liked=null,
        deleteComment,
        editCommentToPost,
        addLikeToComment,
        removeLikeFromComment,
        addReplyToComment
    }) {

        const scrollTop = useRef();
        const [comment, setComment] = useState('');
        const [commentId, setCommentId] = useState('');
        const addLikeToCommentHandler = (commentId) => {
            const likedBy = currentUser._id;
            addLikeToComment(likedBy, postId, commentId).then(() =>
                toast.success('Comment liked')
            )
        }

        function editCommentToPostHandler(commentId, text){
            scrollTop.current.scrollIntoView()
            setCommentId(commentId)
            setComment(`Edit:: ${text}`)
        }


    const replyToComment = (username, commentId) =>{
        scrollTop.current.scrollIntoView()
        setComment(`@${username}: `)
        setCommentId(commentId)
    }

    const prefix = (value, type) =>{
        if (value > 1){
            return ` ${type}s`
        } else{
            return ` ${type}`
        }
    }

    const datePrefix = (interval) =>{
        if (interval > 1){
            return "s ago"
        } else{
            return " ago"
        }
    }

    const deleteCommentHandler = (postId, commentId) =>{
        deleteComment(postId, commentId)
            .then(() => toast.success("Comment deleted "))
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



    const submitComment = (event) => {
        event.preventDefault()
        let commentContent = {
            authorName: currentUser.username,
            authorImage: currentUser.userImage,
            comment,
            createdOn: Date.now(),
        };
        const checkSubmit = comment.split(":")
        const checkMode = comment.split("::")

        if(checkMode.length === 2){
            commentContent = {
                authorName: currentUser.username,
                authorImage: currentUser.userImage,
                comment: checkMode[1],
                createdOn: Date.now(),
            }
            editCommentToPost(commentContent, postId, commentId)
            .then(() => toast.success('Comment edited'))
            return;
        }

        if(checkSubmit.length === 2){
            console.log(checkSubmit[1], postId, commentId)
            addReplyToComment(checkSubmit[1], postId, commentId)
            setComment('')

        }else{
            addCommentToPost(commentContent, postId).then((response) => {
            toast.success('Comment Added')
            setComment('')
        
        }).catch(() => toast.error('Something wrong'))
        }

    };
    
    return (
        <React.Fragment>
            <div ref={scrollTop}/>
            <div className='comments'>
                <form className='comment__form' onSubmit={submitComment}>
                    <AiFillCloseCircle 
                        onClick={() =>setShowModal(false)}
                        className='close-button'/>
                        {(liked && liked.length > 0 ) &&
                            <div className='likes'>
                                <div className='likes__people'>
                                    {liked.filter((liker, i) => i < 3).map((liker) => (
                                        <img 
                                            key={liker._id} 
                                            alt={liker.username}
                                            className='likes__photo' 
                                            src={liker.userImage}/>
                                    ))}
                                </div>
                                {
                                    liked.length > 1 ?
                                    <div className='likes__count'>
                                        {`${liked[0].username} and ${liked.length - 1} others liked this post`}
                                    </div> :
                                    <div className='likes__count'>
                                        {`${liked[0].username} liked this post`}
                                    </div>
                                }
                                
                            </div>
                        }
                    
                    <textarea autoFocus={true} 
                        value={comment}
                        placeholder='Enter comment here...'
                        onChange={e => setComment(e.target.value)} className='comment__input'/>
                    <input type='submit'  className='button button--submit' value='submit' disabled={!comment.length > 0}/>
                    </form>
                    <ul className="comment__list">
                        {commentList !== undefined && commentList.length > 0 && (
                            commentList.map((comment, index) => (
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
                                    
                                    <p className="comment__text">
                                        {comment.comment}
                                        {
                                            comment.likes !== undefined && comment.likes.length > 0 && (
                                                <div className="likes">
                                                    {comment.likes !== undefined && comment.likes.length} 
                                                    <FaHeart/>
                                                </div>
                                            )
                                        }
                                    </p>
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
                                    { comment.replies !== undefined && comment.replies.length > 0 && (
                                        <details className="replies__detail">
                                            <summary className="replies__summary" > 
                                                Comments
                                            </summary>
                                                <ul className='replies__list' id={comment._id}>
                                                    { comment.replies.sort((a, b) =>(
                                                        new Date(b.createdOn) - new Date(a.createdOn) 
                                                    ))
                                                    .map((reply, index) => (
                                                        <li key={reply._id} className="comment__item">
                                                            <img
                                                                src={reply.author.userImage ? reply.author.userImage : noImage}
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
                                </li>
                            ))
                        )}
                </ul>
            </div>
        </React.Fragment>
        
    )
}

Comments.propTypes = {
    commentList: PropTypes.array,
    setShowModal: PropTypes.func,
    currentUser: PropTypes.object,
    addCommentToPost: PropTypes.func,
    postId: PropTypes.string,
    deleteComment: PropTypes.func,
    editCommentToPost: PropTypes.func,
    addLikeToComment: PropTypes.func,
    removeLikeFromComment: PropTypes.func,
    addReplyToComment: PropTypes.func
}

const mapStateToProps = (state) =>({
    currentUser:state.user.currentUser,
})

const mapDispatchToProps = {
    deleteComment,
    editCommentToPost,
    addLikeToComment,
}

export default connect(mapStateToProps, mapDispatchToProps)(Comments)