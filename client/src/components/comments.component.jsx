import React, { useEffect, useState , useRef} from 'react'
import Modal from './modal-window.component'
import noImage from '../assets/images/no-image.png'
import { toast } from 'react-toastify'
import {  FaHeart, FaComments } from "react-icons/fa";
import { BiHide } from "react-icons/bi";
import {connect} from 'react-redux'
import { 
    editComment , 
    deleteComment, 
    addLikeToComment} from '../redux/action/post.actions';
import OutsideAlerter from './clickOutside.component';


function Comments({
    commentList, 
    setShowModal, 
    currentUser, 
    addCommentToPost, 
    postId , 
    deleteComment,
    editComment,
    addLikeToComment,
    removeLikeFromComment,
    addReplyToComment
    }) {
        const scrollTop = useRef()
        const [comment, setComment] = useState('')
        const [commentId, setCommentId] = useState('')
        const [commentDropdownId, setCommentDropdownId] = useState('')
        const [showAllReplies, setShowAllReplies] = useState(false)

        const addLikeToCommentHandler = (commentId) => {
            const likedBy = currentUser._id;
            addLikeToComment(likedBy, postId, commentId).then(() =>
                toast.success('Comment liked')
            );
        };

        function editCommentHandler(commentId, text){
            scrollTop.current.scrollIntoView()
            setCommentId(commentId)
            setComment(`Edit:: ${text}`)
        }

        function setCollapsible (e){
            let content = this.nextElementSibling
            setCommentDropdownId(content.id)
            if(content.style.display === 'block'){
                setShowAllReplies(false)
                content.style.display = 'none'
            }else{
                setShowAllReplies(true)
                content.style.display = 'block'
            }
        }

        function setDropdown (e){
            let el = e.target.parentNode.parentNode.querySelector('.comment__dropdown__list')
            if(el.style.display === 'block'){
                el.style.display = 'none'
            }else{
                el.style.display = 'block'
            }
        }
        useEffect(() =>{
            let checkedLabel = document.querySelectorAll('.comment__button')
            let collapsableComments = document.querySelectorAll('.replies__collapsible')
            collapsableComments.forEach(function(item,i){
                item.addEventListener("click", setCollapsible)
            })
            checkedLabel.forEach(function(check,i){
                check.addEventListener("click", setDropdown)
            })
            return () =>{
                 collapsableComments.forEach(function(item,i){
                    item.removeEventListener("click", setCollapsible)
                })
               checkedLabel.forEach(function(check,i){
                check.removeEventListener("click", setDropdown)
            })
            }
           
        }, [commentList])

  
    
    
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
        }else{
            return " ago"
        }
    }

    const deleteCommentHandler = (postId, commentId) =>{
        deleteComment(postId, commentId)
            .then(() => toast.success("comment replied ") )
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
            };
          editComment(commentContent, postId, commentId)
          .then(() => toast.success('Comment edited') )
          return;
      }
      if(checkSubmit.length === 2){
        addReplyToComment(commentId, checkSubmit[1])
        setComment('')

      }else{
        addCommentToPost(commentContent, postId).then((response) => {
        toast.success('Comment Added')
        setComment('')
    
      }).catch(() => toast.error('Something wrong'))
      }

    
  };
    
    return (
        <OutsideAlerter>
        <Modal closeHandler={() =>setShowModal(false)}>
            <div ref={scrollTop}/>
            <div className='comments'>
                <form className='comment__form' onSubmit={submitComment}>
                    <textarea autoFocus={true} 
                        value={comment}
                        placeholder='Enter comment here...'
                        onChange={e => setComment(e.target.value)} className='comment__input'/>
                    <input type='submit'  className='post-box__button' disabled={!comment.length > 0}/>
                    </form>
                    <ul className="comment__list">
                        {commentList !== undefined && commentList.length > 0 && (
                            commentList.map((comment, index) => (
                                <li key={comment._id} className="comment__item">
                                    <img
                                        src={comment.authorImage ? comment.authorImage : noImage}
                                        alt="your profile"
                                        className="user-icon__photo comment__user-icon"
                                    />
                                    <div className="comment__user">
                                        <span className="username">{`@${comment.authorName}`}</span>
                                        <span className="time">{timeAgo(comment.createdOn)}</span>
                                        
                                    </div>
                                    <input className="comment__checked" type='checkbox' style={{display: 'none'}} id='comment'/>
                                    <label className="comment__button" htmlFor='comment' id={comment._id}>
                                        <span className="comment__icon"></span>
                                    </label>
                                    <ul className='comment__dropdown__list'>
                                        <li className='comment__dropdown__item' 
                                            onClick={() => editCommentHandler(comment._id, comment.comment) } 
                                            >Edit</li>
                                        <li 
                                            onClick={() => deleteCommentHandler(postId, comment._id)}
                                            className='comment__dropdown__item'>Delete</li>
                                    </ul>
                                    <p className="comment__text">{comment.comment}</p>
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
                                        <div className="comment__status">
                                            <div className="likes">
                                                {comment.likes !== undefined && comment.likes.length} 
                                                <FaHeart/>
                                            </div>
                                        </div>
                                    </div>
                                    { comment.replies !== undefined && comment.replies.length > 0 && (
                                        <React.Fragment>
                                            {
                                                !( showAllReplies && commentDropdownId === comment._id) ?
                                                    <div  className="replies__collapsible" >
                                                        <FaComments/>
                                                        {`View ${comment.replies.length}${prefix(comment.replies.length, 'Comment')}`}
                                                    </div> :
                                                    <div  className="replies__collapsible">
                                                        <BiHide/>
                                                        Hide Comments
                                                    </div>
                                            }
                                            
                                            <ul className='replies__list' id={comment._id}>
                                                { comment.replies.sort((a, b) =>(
                                                        new Date(b.createdOn) - new Date(a.createdOn) 
                                                    )).map((reply, index) => (
                                                    <li key={reply._id} className="comment__item">
                                                        <img
                                                            src={reply.author.userImage ? reply.author.userImage : noImage}
                                                            alt="your profile"
                                                            className="user-icon__photo comment__user-icon"
                                                        />
                                                        <div className="comment__user">
                                                            <span className="username">{`@${reply.author.username}`}</span>
                                                            <span className="time">{timeAgo(reply.createdOn)}</span>  
                                                        </div>
                                                        <p className="comment__text">{reply.comment}</p>
                                                    </li>
                                                    ))
                                                }
                                                
                                        </ul>
                                    </React.Fragment>
                                    )}
                                </li>
                            ))
                        )}
                </ul>
            </div>
        </Modal>
        </OutsideAlerter>
        
    )
}

  const mapStateToProps = (state) =>({
    currentUser:state.user.currentUser,
 })

const mapDispatchToProps = {
    deleteComment,
    editComment,
    addLikeToComment
}



export default connect(mapStateToProps, mapDispatchToProps)(Comments)