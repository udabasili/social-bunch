import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { addPost, editPost } from '../../redux/posts/post.actions';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';

const TextTab = ({
        closeModal,
        addPost,
        editPost,
        loadingHandler,
        editing=false,
        editData=null
    }) => {

    const [text, setText] = useState('');

    useEffect(() => {
        if(editing){
            setText(editData.text)
        }
    }, [editing])

    const addPostHandler = () => {

        const post = {};
        if(text.length === 0){
            toast.error('Text cannot be empty')
            return;
        }
        loadingHandler(true)
        post.text = text;

        if(editing){
            editPost(post, editData._id, 'text')
                .then(() => {
                    loadingHandler(false)
                    closeModal()
                })
                .catch(() => {
                    loadingHandler(false)
                })
            return;
        }

        addPost(post, 'text')
            .then(() =>{
                loadingHandler(false)
                closeModal()
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
                    <button 
                        onClick={closeModal}
                        className="tab-button close">Close</button>
                    <button 
                        onClick={addPostHandler}
                        className="tab-button">Submit</button>
                </div>
            </div>
        </React.Fragment>
    )
}

TextTab.propTypes = {
    closeModal: PropTypes.func,
    addPost: PropTypes.func,
    currentUser: PropTypes.object,
    loadingHandler: PropTypes.func
}

const mapStateToProps = (state) => ({
    currentUser: state.user.currentUser
})

const mapDispatchToProps = {
    addPost,
    editPost
}

export default connect(mapStateToProps, mapDispatchToProps)(TextTab);
