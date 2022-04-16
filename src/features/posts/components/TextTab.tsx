import { Button } from '@/components/Elements';
import React, { useState, useEffect } from 'react';
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

const TextTab = ({
        closeModal,
        loadingHandler,
        isLoading,
        editing=false,
        editData={} as PostAttribute
    }: Props) => {

    const [text, setText] = useState('');
    const {updatePost} = useUpdatePost(editData.id || '')
    const {createPostFn} = useCreatePost()


    useEffect(() => {
        if(editing && editData.text){
            setText(editData.text)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editing])

    const addPostHandler = () => {
        const postData = {} as PostAttribute;
        if(text.length === 0){
            toast.error('Text cannot be empty')
            return;
        }
        loadingHandler(true)
        postData.text = text;
        if(editing){
            updatePost({updatedPost: postData})
            .then(() => {
                loadingHandler(false)
                closeModal(true)
            })
            .catch(() => {
                loadingHandler(false)
            })
            return;
        }

        createPostFn({postData, type: 'text'})
            .then(() =>{
                loadingHandler(false)
                closeModal(true)
            })
            .catch(() => {
                loadingHandler(false)
            })
    }

    return (
        <React.Fragment>
            <div className="text-tab" id='tab-item'>
                <textarea 
                    onChange={e => setText(e.target.value)}
                    value={text}
                    placeholder='Add your text here'
                    className='add-post__text'
                />
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
        </React.Fragment>
    )
}


export default TextTab