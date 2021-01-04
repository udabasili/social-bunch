import React,{useState} from 'react'
import { connect } from 'react-redux'
import { useEffect } from 'react';
import { addPost, editPost } from '../redux/action/post.actions';
import Modal from './modal-window.component';
import { toast } from 'react-toastify';

function PostForm({ showModalHandler, addPost, editMode, currentPost, editPost}) {
    const [post, setPost] = useState('')
    useEffect(() => {
        if(editMode){
            setPost(currentPost.text)
        }
    },[editMode])
    
    const changeTextHandler = (e) => {
        setPost(e.target.value)
    }
    const onSubmitHandler = (e) => {
        e.preventDefault()
        if(editMode){
            editPost(post, currentPost._id)
                .then(() => {
                    setPost('')
                    showModalHandler(false, 'top', 'center', "Post Successfully Edit", true )
                    })
                .catch((error) => {
                    showModalHandler(
                        false,
                        "top",
                        "center",
                        error,
                        'error',
                        true
                    );
                })
                

        } else{
            addPost(post)
                .then(() => {
                    setPost('')
                    toast.success('Post added successfully')
                    showModalHandler(false);
                })
                .catch((error) => {
                    toast.error('Something went wrong. Try again later')
                    showModalHandler(false);
                })
        }
        
    }
    return (
        <Modal setCloseButton={false} >
            <form className='modal-form' onSubmit={onSubmitHandler}>
                <textarea
                    placeholder='Type in your post here '
                    value={post}
                    autoFocus={true}
                    onChange={changeTextHandler} className='post-box__input' required />
                <input type="submit" value="Submit" className='post-box__button' disabled={!post.length > 0} />
                <input type='button'  value="Close" 
                    onClick={() => showModalHandler(false)} className='post-box__button close' />
            </form>
        </Modal>
        
    )
}




const mapDispatchToProps = {
    addPost,
    editPost
}

export default connect(null, mapDispatchToProps)(PostForm)