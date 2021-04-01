import React from 'react';
import PropTypes from 'prop-types'
import ImagePost from './post/image-post.component';
import VideoPost from './post/video-post.component';
import TextPost from './post/text-post.component';
import { useSelector } from 'react-redux';
import {createSelector} from 'reselect';

function PostWindow(props) {

    const postId = props.match.params.postId
    const selectFilterPosts = createSelector(
        state => state.posts,
        posts => posts.filter((post) => post._id === postId )
    )

    const filteredPost = useSelector(selectFilterPosts)[0]
    
    const handlePostType = (post) => {
        const type = post.type;
        switch (type) {
            case 'image':
                return ( 
                    <ImagePost 
                        post={post}
                        commentModal={false}
                    /> )
            case 'text':
                return ( 
                    <TextPost 
                        post={post}
                        commentModal={false} 
                        show={true}
                    /> )
            case 'video':
                return ( 
                    <VideoPost 
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

