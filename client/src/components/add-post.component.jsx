import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { AiTwotoneFileText } from 'react-icons/ai';
import { FaRegFileImage } from 'react-icons/fa';
import { AiOutlineVideoCamera } from 'react-icons/ai';
import TextTab from './add-post/text.tab.component';
import ImageTab from './add-post/image-tab.component';
import VideoTab from './add-post/video-tab.component';
import Loading from './loader.component';

const AddPost = ({
    closeModal,
    editPost=false,
    editData=null,
    editType=null
    }) => {

    const [currentTab, switchTab] = useState('text-tab');
    const [isLoading, loadingHandler] = useState(false)

    useEffect(() => {
        if(editPost){
            switchTab(editType)
        }
    }, [editPost, editType])

    const onChangeHandler = (e) =>{
        const id = e.target.value;
        switchTab(id)
    }

    return (
        <React.Fragment>
            {isLoading && <Loading/>}
            <div className="tab add-post">
                <input 
                    type="radio" 
                    className="tab__input"
                    name="tab-radio" 
                    value="text-tab"
                    id="text-tab" 
                    onChange={onChangeHandler}
                    checked={currentTab === "text-tab"}
                />
                <input 
                    type="radio" 
                    className="tab__input"
                    name="tab-radio"  
                    id="image-tab"
                    checked={currentTab === "image-tab"}
                    value="image-tab"
                    onChange={onChangeHandler}
                />
                <input 
                    type="radio" 
                    name="tab-radio" 
                    className="tab__input"
                    onChange={onChangeHandler}
                    id="video-tab" 
                    checked={currentTab === "video-tab"}
                    value="video-tab"
                />
                {
                    !editPost && 
                    <nav className="tab__nav">
                        <ul className="tab__list">
                            <li 
                                className = {`tab__item ${currentTab === "text-tab" ? "active" : ""}`}
                                >
                                <label 
                                    className="tab__label"
                                    htmlFor="text-tab">
                                        <span>Text</span>
                                        <AiTwotoneFileText/>
                                </label>
                            </li>
                            <li 
                                className = {
                                    `tab__item ${currentTab === "image-tab" ? 'active' : ""}`
                                }
                                >
                                <label 
                                    className ="tab__label"
                                    htmlFor="image-tab">
                                    <span>Image</span>
                                    <FaRegFileImage/>
                                </label>
                            </li>
                            <li className = {
                                    `tab__item ${currentTab === 'video-tab' ? 'active' : ""}`
                                }
                                >
                                <label 
                                    className ="tab__label"
                                    htmlFor="video-tab">
                                    <span>Video</span>
                                    <AiOutlineVideoCamera/>
                                </label>
                            </li>
                        </ul>
                    </nav>
                }
                <section className="tab__section">
                    <TextTab 
                        closeModal={closeModal} 
                        editing={editPost}
                        editData={editData}
                        loadingHandler={loadingHandler}/>
                    <ImageTab 
                        loadingHandler={loadingHandler}
                        closeModal={closeModal}/>
                    <VideoTab 
                        loadingHandler={loadingHandler}
                        editing={editPost}
                        editData={editData}
                        closeModal={closeModal}/>
                </section>
            </div>
        </React.Fragment>
    );
};


AddPost.propTypes = {
    closeModal: PropTypes.func
};


export default AddPost;
