import { Button } from '@/components/Elements';
import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { toast } from 'react-toastify';
import { useCreatePost } from '../api/createPost';
import { useUpdatePost } from '../api/updatePost';
import { PostAttribute } from '../types';

interface Props {
    closeModal: (e: boolean) => void
    loadingHandler: (e: boolean) => void
    editing: boolean
    editData: PostAttribute
    isLoading: boolean
}

const VideoTab = ({
        closeModal,
        loadingHandler,
        isLoading,
        editing=false,
        editData={} as PostAttribute
    }: Props) => {

    const [videoUrl, setVideoUrl] = useState('');
    const [videoLoaded, setVideoLoaded] = useState(false);
    const [title, setTitle] = useState('')
    const {updatePost} = useUpdatePost(editData.id || '')
    const {createPostFn} = useCreatePost()

    useEffect(() => {
        if (editing && editData?.video?.title && editData?.video?.link) {
            setTitle(editData?.video?.title )
            setVideoLoaded(true)
            setVideoUrl(editData.video.link)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editing])

    const submitUrl = (e:  React.KeyboardEvent<HTMLInputElement>) => {
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
        const postData = {} as PostAttribute;
        if (title?.length === 0) {
            toast.error('Title cannot be empty')
            return;
        }
        if (!videoLoaded) {
            toast.error('Video url cannot be empty')
            return;
        }
        loadingHandler(true)
        postData.title = title
        postData.link = videoUrl
        

        if (editing) {
            updatePost({ updatedPost: postData})
            .then(() => {
                toast.success('Post Updated')
                loadingHandler(false)
                closeModal(true)
            })
            .catch(() => {
                loadingHandler(false)
            })
        }

        createPostFn({postData, type: 'video'})
            .then(() => {
                closeModal(true)
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
            <div className='add-post__image'>
                {
                    ( videoLoaded  && videoUrl )&& (
                        <ReactPlayer 
                            width="100%"
                            height="100%"
                            url={videoUrl} 
                        />
                    )

                }
            </div>
            <div className="tab-buttons">
            <Button 
                    type='button'
                    size="lg"
                    variant="danger"
                    className="mr-2"
                    disabled={isLoading}
                    onClick={() => closeModal(true)}

                    >
                        Close
                </Button>
                <Button 
                    type='button'
                    size="lg"
                    variant="primary"
                    isLoading={isLoading}
                    disabled={isLoading}
                    onClick={addPostHandler}
                    >
                        Submit
                </Button>
            </div>
        </div>
    )
}



export default VideoTab

