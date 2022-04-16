import noImage from '@/assets/images/no-image.png'
import { FaHeart } from "react-icons/fa";
import { toast } from 'react-toastify';
import { useDeleteComment } from '../api/deleteComment';
import { CommentAttributes } from '../type';
import { useLikeComment } from '../api/likeComment';
import { timeAgo } from '@/utils/time';
import { useDocument } from 'swr-firestore-v9';
import { Loader } from '@/components/Elements';


type CommentProps = {
    postId: string
    commentId: string
    currentUserId: string
    scrollTop: any
    setCommentId: (e: string) => void 
    setComment: (e: string) => void
}

function Comment({
    postId, 
    commentId,
    scrollTop,
    setComment,
    setCommentId,
    currentUserId
    }: CommentProps) {

    const { data, error, isValidating } = useDocument<CommentAttributes>(commentId ? `comments/${commentId}` : null, {
        listen: true,
      });
    const { deleteComment } = useDeleteComment(postId, commentId)
    const { addLikeToComment , removeLikeFromComment } = useLikeComment({ commentId: commentId})
    const likedBy = currentUserId;
    const deleteCommentHandler = () => {
        deleteComment()
    }
   
    const addLikeToCommentHandler = () => {
        addLikeToComment(likedBy).then(() =>
            toast.success('Comment liked')
        )
    }

    if (!data && !error ) return <Loader/>

    function editCommentToPostHandler( text: string) {
        scrollTop.current.scrollIntoView()
        setCommentId(commentId)
        setComment(`Edit:: ${text}`)
    }


    const replyToComment = (username: string) => {
        scrollTop.current.scrollIntoView()
        setComment(`@${username}: `)
        setCommentId(commentId)
    }

    return (
            <li key={data?._id} className="comment__item">
                <img
                    src={data?.authorImage ? data?.authorImage : noImage}
                    alt={`${data?.authorName}`}
                    className="comment__photo"
                />
                <div className="comment__user">
                    <span className="username">{`@${data?.authorName}`}</span>
                    <span className="time">{timeAgo(data?.createdOn as any)}</span>
                    
                </div>
                <details  id={data?._id}>
                    <summary className = "comment__button" >
                        <span  className="comment__icon"></span>
                    </summary>
                    <ul className='comment__dropdown__list'>
                        <li className='comment__dropdown__item' 
                            onClick={() => editCommentToPostHandler(data?.comment as string) } 
                            >Edit</li>
                        <li 
                            onClick={deleteCommentHandler}
                            className='comment__dropdown__item'>Delete</li>
                    </ul>
                </details>
                
                <div className="comment__text">
                    {data?.comment}
                    {
                        (data?.likes !== undefined && data?.likes.length > 0 && !isValidating) && (
                            <div className="likes">
                                {data?.likes !== undefined && data?.likes.length} 
                                <FaHeart/>
                            </div>
                        )
                    }
                </div>
                    <div className="comment__options">
                        <div className="response" id={data?._id}>
                        {(!isValidating && !data?.likes.includes(currentUserId)) ? (
                            <div
                                className="response__item"
                                style={{ color: "red", cursor: "pointer" }}
                                title='like'
                                onClick={() => addLikeToCommentHandler()}
                            >
                                Like
                            </div>
                        ) : (
                            <div className="response__item" 
                                onClick={() => removeLikeFromComment(likedBy)}
                                style={{ color: "black" }} 
                                title='liked'>
                                    Unlike
                            </div>
                        )}
                        <div 
                            className="response__item" 
                            style={{ color: "black" }} 
                            onClick={() => replyToComment(data?.authorName as string)}
                            title='liked'>
                                Reply
                        </div>
                    </div>
                </div>
                { data?.replies  && data.replies.length > 0 && (
                    <details className="replies__detail">
                        <summary className="replies__summary" > 
                            Comments
                        </summary>
                            <ul className='replies__list' id={data._id}>
                                {  data.replies.sort((a, b) =>(
                                    new Date(b.createdOn.seconds).getTime() - new Date(a.createdOn.seconds).getTime()
                                ))
                                .map((reply, index) => (
                                    <li key={`${reply.author.uid}-${index}-`} className="comment__item">
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
            </li> 
    )
}


// const mapStateToProps = (state, ownProps) => {
//     const id = ownProps.id;
//     const comments = state.firestore.data.comments;
//     let comment ;
//     let replies = [];
//     if (comments) {
//         for (let key in comments) {
//             comment =  ({
//                 _id: key,
//                 ...comments[id]
//             })
             
//         }
//         if (comment.replies && comment.replies.length > 0) {
//             replies = [...comment.replies]
//         }
//     }else {
//         comment = null
//     }
    
//     return {
//     currentUser: state.user.currentUser,
//     comment,
//     replies
// }}



export default Comment
