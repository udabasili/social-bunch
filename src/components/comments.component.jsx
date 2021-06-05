import React, { useState , useRef} from 'react'
import { connect } from 'react-redux'
import { addLikeToComment, editCommentToPost } from '../redux/posts/post.actions';
import { AiFillCloseCircle } from 'react-icons/ai';
import PropTypes from 'prop-types';
import Comment from './comment.component';
import { toast } from 'react-toastify'

function Comments({
        commentList, 
        setShowModal, 
        currentUser, 
        addCommentToPost, 
        postId , 
        owner,
        liked=null,
        editCommentToPost,
        addReplyToComment
    }) {

    const scrollTop = useRef();
    const [comment, setComment] = useState('');
    const [commentId, setCommentId] = useState('');

    const submitComment = (event) => {
        event.preventDefault()
        let commentContent = {
            authorName: currentUser.username,
            authorImage: currentUser.image,
            comment,
            createdOn: Date.now(),
        };
        const checkSubmit = comment.split(":")
        const checkMode = comment.split("::")

        if(checkMode.length === 2){
            commentContent = {
                authorName: currentUser.username,
                authorImage: currentUser.image,
                comment: checkMode[1],
                createdOn: Date.now(),
            }
            editCommentToPost(commentContent, postId, commentId)
            .then(() => {
                toast.success('Comment edited')
                setComment('')
            })
            return;
        }

        if(checkSubmit.length === 2){
            addReplyToComment(checkSubmit[1], postId, commentId)
            setComment('')

        }else{
            addCommentToPost(commentContent, postId, owner).then((response) => {
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
                                {
                                    liked.length > 1 ?
                                    <div className='likes__count'>
                                        {` ${liked.length } people liked this post`}
                                    </div> :
                                    <div className='likes__count'>
                                        {`${liked.length} person liked this post`}
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
                                <Comment
                                    id={comment}
                                    key={comment}
                                    postId={postId}
                                    scrollTop={scrollTop}
                                    setComment={setComment}
                                    setCommentId={setCommentId}
                                /> 
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
    editCommentToPost: PropTypes.func,
}

const mapStateToProps = (state) =>({
    currentUser:state.user.currentUser
})

const mapDispatchToProps = {
    addLikeToComment,
    editCommentToPost
}


export default connect(mapStateToProps, mapDispatchToProps)(Comments);

