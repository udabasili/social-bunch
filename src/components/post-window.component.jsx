import React from 'react';
import PropTypes from 'prop-types'
import ImagePost from './post/image-post.component';
import VideoPost from './post/video-post.component';
import TextPost from './post/text-post.component';
import { useSelector } from 'react-redux';
import {createSelector} from 'reselect';
import {  populate } from 'react-redux-firebase'

const populates = [{
    child: 'user',
    root: 'users'
}]

function PostWindow({
        match,
        currentUser
    }) {

    const postId = match.params.postId;
    const selectFilterPosts = createSelector(
        state => populate(state.firestore, 'posts', populates) ,
        postsRecord => {
            let posts = []
            if (Object.keys(postsRecord).length > 0) {
                for (let key in postsRecord) {
                    if (postsRecord[key]) {
                        posts.push({
                            _id: key,
                            ...postsRecord[key]
                        })
                    }

                }
            }
            console.log(postId)
            return posts.filter((post) => post._id === postId )
        }
    )

    const filteredPost = useSelector(selectFilterPosts)
    
    const handlePostType = (post) => {
        const type = post.type;
        switch (type) {
            case 'image':
                return ( 
                    <ImagePost 
                        post={post}
                        commentModal={false}
                        currentUser={currentUser}
                    /> )
            case 'text':
                return ( 
                    <TextPost 
                        post={post}
                        commentModal={false} 
                        show={true}
                        currentUser={currentUser}
                    /> )
            case 'video':
                return ( 
                    <VideoPost 
                        currentUser={currentUser}
                        post={post}
                        commentModal={false}
                /> )
            default:
                <div/>
        }
    }

    return (
        <div className='post-window'>
            { handlePostType(filteredPost) }
        </div>
    )
}

PostWindow.propTypes = {
    post: PropTypes.object
}

export default PostWindow

