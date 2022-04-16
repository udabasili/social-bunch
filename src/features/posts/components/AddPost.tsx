import React, { ChangeEvent, useEffect, useState } from 'react';
import { AiTwotoneFileText } from 'react-icons/ai';
import { FaRegFileImage } from 'react-icons/fa';
import { AiOutlineVideoCamera } from 'react-icons/ai';
import { Loader } from '@/components/Elements';
import { PostAttribute } from '../types';
import TextTab from './TextTab';
import ImageTab from './ImageTab';
import VideoTab from './VideoTab';

type AddPostProps = {
    closeModal: () => void
    editPost?: boolean,
    editType?: string | null,
    editData?: PostAttribute 
}

const AddPost = ({
    closeModal,
    editPost=false,
    editData={} as PostAttribute,
    editType=null
    }: AddPostProps) => {

    const [currentTab, switchTab] = useState('text-tab');
    const [isLoading, loadingHandler] = useState(false)

    useEffect(() => {
        if(editPost){
            switchTab('text-tab')
        }
    }, [editPost, editType])

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) =>{
        const id = e.target.value;
        switchTab(id)
    }

    return (
        <React.Fragment>
            {isLoading && <Loader/>}
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
                        isLoading={isLoading}
                        editData={editData as PostAttribute}
                        loadingHandler={loadingHandler}/>
                    <ImageTab 
                        loadingHandler={loadingHandler}
                        isLoading={isLoading}
                        closeModal={closeModal}/>
                    <VideoTab 
                        loadingHandler={loadingHandler}
                        editing={editPost}
                        isLoading={isLoading}
                        editData={editData as PostAttribute}
                        closeModal={closeModal}/>
                </section>
            </div>
        </React.Fragment>
    );
};


export default AddPost;
