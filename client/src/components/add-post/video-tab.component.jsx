import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import ReactPlayer from 'react-player/lazy'
import { toast } from 'react-toastify';
import {
    addPost,
    editPost
} from '../../redux/posts/post.actions';
import { connect } from 'react-redux';

/**
 *
 *
 * @param {function} {
 *         closeModal,
 *         addPost
 *     }
 * @return {JSX} 
 */
function VideoTab ({
        closeModal,
        addPost,
        editPost,
        loadingHandler,
        editing = false,
        editData = null
    }){

    const [videoUrl, setVideoUrl] = useState('');
    const [videoLoaded, setVideoLoaded] = useState(false);
    const [title, setTitle] = useState('')

    useEffect(() => {
        if (editing) {
            setTitle(editData.video.title)
            setVideoLoaded(true)
            setVideoUrl(editData.video.link)
        }
    }, [editing])

    const submitUrl = (e) => {
        
        if(e.key === "Enter"){
            const youtubeRegex = /(?=.*youtube)(?=.*watch)/;
            if (!youtubeRegex.test(videoUrl)) {
                toast.error("The link provided is not a valid youtube link");
                return;
            }
            setVideoLoaded(true);
        }
    }

    const addPostHandler = () => {
        const post = {};
        if (title.length === 0) {
            toast.error('Title cannot be empty')
            return;
        }

        if (!videoLoaded) {
            toast.error('Video url cannot be empty')
            return;
        }
        loadingHandler(true)
        post.title = title
        post.link = videoUrl
        

        if (editing) {
            editPost(post, editData._id, 'video')
                .then(() => {
                    toast.success('Post Updated')
                    loadingHandler(false)
                    closeModal()
                })
                .catch(() => {
                    loadingHandler(false)
                })
            return;
        }

        addPost(post, 'video')
            .then(() => {
                loadingHandler(false)
                closeModal()
            })
            .catch(() =>{
                loadingHandler(false)
                toast.error('Error uploading image')
            })
    }

    return (
        <div className="video-tab"  id='tab-item'>
            <input 
                type="text"
                placeholder='Add Video title'
                className='add-post__title video'
                value={title}
                onChange={e => setTitle(e.target.value)}
            />
            <input 
                type="text"
                placeholder='Add Youtube Link Url and Press Enter'
                className='add-post__title video'
                value={videoUrl}
                onChange = {e => setVideoUrl(e.target.value)}
                onKeyDown={submitUrl}
            />
            <div
                className='add-post__image'
            >
                {
                    ( videoLoaded  && videoUrl )&& (
                        <ReactPlayer 
                            width="100%"
                            height="100%"
                            url={videoUrl} />
                    )

                }
            </div>
            <div className="tab-buttons">
                <button 
                    onClick={closeModal}
                    className="tab-button close">
                    Close
                </button>
                <button 
                    onClick={addPostHandler}
                    className="tab-button">
                    Submit
                </button>
            </div>
        </div>
    )
}

VideoTab.propTypes = {
    closeModal: PropTypes.func,
    addPost: PropTypes.func,
    currentUser: PropTypes.object
}

const mapStateToProps = (state) => ({
    currentUser: state.user.currentUser,

})

const mapDispatchToProps = {
    addPost,
    editPost
}


export default connect(mapStateToProps, mapDispatchToProps)(VideoTab);

