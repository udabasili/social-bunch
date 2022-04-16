import React, { useState } from 'react'
import { AiFillLike, AiOutlineComment, AiOutlineLike } from 'react-icons/ai';
import { PostAttribute, PostLikedBy } from '../types';
import Modal from '@/components/Modal/Modal';
import { useAddCommentToPost } from '@/features/comment/api/addCommentToPost';
import Comments from '@/features/comment/component/Comments';
import { timeAgo } from '@/utils/time';
import { useAuth } from '@/lib/auth';
import { useLikePost } from '../api/likePost';
import { useDeletePost } from '../api/deletePost';
import Skeleton from 'react-loading-skeleton'
import ImageError from '@/assets/images/no-image.png'

interface Props {
    post: PostAttribute;
    show?: boolean
    commentModal?: boolean
}
const ImagePost = ({
    post,
    show = false,
    commentModal=true,
    }: Props) => {

    const [showModal, setShowModal] = useState(show);
    const { currentUser } = useAuth()
    const { addCommentToPost } = useAddCommentToPost(post.id);
    const { likePost } = useLikePost(post.id)
    const { deletePostFn } = useDeletePost(post.id)
    const [imageLoading, setImageLoading] = useState(true)
    const [postImageLoading, setPostImageLoading] = useState(true)
    const [commentimageLoading, setCommentImageLoading] = useState(true)


    const prefix = (value: number, type: string) => {
        if (value > 1) {
            return `${value} ${type}s`
        } else {
            return `${value} ${type}`
        }
    }

    const postLikedByCurrentUser = (array: Array<PostLikedBy>) => {
        return array.filter((value) => {
            return  value.uid === currentUser.uid
        }).length > 0
    }


    const addLike = () => {
        const likedBy = {
            uid: currentUser.uid,
            username: currentUser.username,
            image: currentUser.image as string
        }
        const postOwner = post.user.uid
        likePost({ postOwner, likedBy })
    }

    const commentComponent = () =>{
        if (commentModal){
            return (
                <Modal>
                    <Comments 
                        post={post} 
                        liked={post.likes}
                        owner={post.user.uid}
                        commentList={post.comments} 
                        addCommentToPost={addCommentToPost}
                        setShowModal={setShowModal}
                    />
                </Modal>
            )
        }else{
            return (
                <Comments 
                    post={post}
                    liked={post.likes}
                    commentList={post.comments}
                    addCommentToPost={addCommentToPost}
                    setShowModal={setShowModal} 
                    owner={post.user.uid}
                   />
            )
        }
    }

    return (
        <React.Fragment>
        <div className='post post--image' id={post.id}>
            <div 
                className={`
                    avatar
                    ${post.user.image ? '': 'no-image'}
                `}>
                    {
                        post.user.image && (
                            <>
                            {
                                commentimageLoading && (
                                    <Skeleton
                                        height="100%"
                                        duration={1}
                                        containerClassName="avatar-skeleton"
                                    />
                                )
                            }
                            
                             <img 
                                src={post.user.image} 
                                alt={post.user.username}
                                loading="lazy"
                                onLoad={() => setCommentImageLoading(false)}
                                

                            />
                            </>
                            
                        )
                    }
               
            </div>
            <div className="user-info">
                <span className={`
                    username
                    ${post.user.username ? '': 'no-username'}
                `}>
                    {
                        post.user.username ? 
                        post.user.username :
                        ''
                    }
                </span>
                
                <span className='date'>{timeAgo(post.createdAt)}</span>
            </div>
            <div className="u-margin-bottom-small u-margin-top-small" id="title">
                <h3 className="tertiary-header">{post.image?.title}</h3> 
            </div>
            <div  className='images'>
                {
                    post.image?.images?.map((image, i) => ( 
                        <>
                            {
                                postImageLoading && (
                                    <Skeleton
                                        height="100%"
                                        duration={1}
                                        containerClassName={`avatar-skeleton avatar-skeleton--${ i + 1 }`}
                                    />
                                )
                            }
                            <img 
                                src={image} 
                                className={`image--${ i + 1 }`}
                                key={`${image}-${i}`}
                                alt={`${image}-1`} 
                                loading="lazy"
                                onError={({ currentTarget }) => {
                                    currentTarget.onerror = null; // prevents looping
                                    currentTarget.src=ImageError;
                                    currentTarget.style.width= "15rem"
                                    currentTarget.style.justifySelf= "center"
                                    setPostImageLoading(false)
                                }}
                                onLoad={() => {
                                    if ( i === 0) setPostImageLoading(false)
                                }}
                            />
                
                            </>
                    
                    ))
                }
            </div>
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
                            `${prefix( post.comments.length, 'Comment')} `
                            }
                            
                        </div>
                    </div>
                    {
                        currentUser.username === post.user.username && (
                            <div className="post__edit">
                                <div className="delete" onClick={deletePostFn}>
                                    Delete
                                </div>
                            </div>
                        )
                    }
            </div>
            <hr />
            <div className="response">
                {
                    !postLikedByCurrentUser(post.likes) ? (
                <div
                    className="response__item"
                    style={{ color: "red", cursor: "pointer" }}
                    onClick={addLike}
                    title='like'
                >
                    <AiOutlineLike className="response__icon" />
                </div>
                ) : (
                <div className="response__item liked" style={{ color: "red" }} title='liked'>
                    <AiFillLike className="response__icon" />
                    <p className="response__label" >Liked</p>
                </div>
                )}
                <div className="response__item" onClick={() => setShowModal(true)}>
                    <AiOutlineComment className="response__icon" />
                </div>
            </div>
            <hr/>
            <div className="comment">
                <div className="comment__input-container">
                {(
                    <div className="avatar">
                        <>
                            {
                                imageLoading && (
                                    <Skeleton
                                        height="100%"
                                        duration={1}
                                        containerClassName="avatar-skeleton"
                                    />
                                )
                            }
                            <img 
                                src={
                                    currentUser.image || "https://img.icons8.com/ios/50/000000/user-male-circle.png"
                                }
                                alt={currentUser.username}
                                loading="lazy"
                                onLoad={() => setImageLoading(false)}
                            />
                
                            </>
                            
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
                        commentComponent()
                    }
            </div>
        </div>
        </React.Fragment>

    );
};


export default ImagePost
