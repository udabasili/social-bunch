import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { BsFillPlusCircleFill } from 'react-icons/bs';
import { FaTimesCircle } from 'react-icons/fa';
import { addImagePost } from '../../redux/posts/post.actions';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';

function ImageTab({ 
    closeModal,
    addImagePost,
    loadingHandler,
    }) {

    const [ImageUploaded, setImageUploaded] = useState(false)
    const [ImageUrls, setImageUrls] = useState([])
    const [title, setTitle] = useState('')

    const uploadImage = () => {
        let currentImages = [...ImageUrls];
        currentImages = currentImages.filter((image) => (
            image !== ""
        ))
        const imageUpload = document.querySelector(".image-upload");
        imageUpload.click();
        imageUpload.onchange = function(e){
            if (imageUpload.files[0] !== undefined){
                currentImages.push(imageUpload.files[0]);
                currentImages.push("");
                setImageUrls([...currentImages]);
                setImageUploaded(true);
            }
            
        }
    }

    const closeButton = (e) => {
        let currentImages = [...ImageUrls]
        let id  = e.target.parentNode.id || e.target.parentNode.parentNode.id;
        const currentIndex = id.split("-")[1];
        currentImages = currentImages.filter((image, i) => (
            i !== Number(currentIndex)
        ))
        setImageUrls([...currentImages]);
    }

    const submitHandler = () =>{
        const formData = new FormData()
        if (title.length === 0) {
            toast.error('Image must have a title')
            return;
        }
        if (ImageUrls.length === 0){
            toast.error('You must have at least one image uploaded')
            return;
        }
        loadingHandler(true)
        const currentImages = ImageUrls.filter((image) => (
            image !== ""
        ))
        currentImages.forEach((img) =>{
            formData.append('images', img)
        })
        formData.append('text',title)
        addImagePost(formData)
            .then(() => {
                loadingHandler(false)
                closeModal()
            })
            .catch(() =>{
                loadingHandler(false)
            })
    }

    return (
        <div className="image-tab"  id="tab-item">
            <input
                type="file"
                accept="image/*"
                className="image-upload"
                style={{display: "none"}}/>
            <input 
                type="text"
                placeholder="Add Title"
                onChange={ e => setTitle(e.target.value)}
                className="add-post__title"
            />
            {
                !ImageUploaded ? 
                <div className="add-post__image">
                    <button 
                        onClick={uploadImage}
                        className="tab-button">
                        Upload
                    </button>
                </div> :
                <div className="add-post__images">
                    {
                        ImageUrls.map((image, index) =>(
                            image === "" ? 
                            <div key = {
                                    `upload-${index}`
                                }
                                id={`upload-${index}`}
                            >
                                <BsFillPlusCircleFill 
                                    onClick = {
                                        uploadImage
                                    }
                                />
                            </div> :
                            <div key={`upload-${index}`} id={`upload-${index}`}>
                                <img  alt={`upload-${index}`} src={URL.createObjectURL(image)}/>
                                <FaTimesCircle 
                                    onClick={closeButton}
                                    className="remove-image"/>
                            </div>
                        ))
                    }
                </div>
            }
            <div className="tab-buttons">
                <button 
                    onClick={closeModal}
                    className="tab-button close">
                        Close
                </button>
                <button 
                    onClick={submitHandler}
                    className="tab-button">
                        Submit
                </button>
            </div>
        </div>
    )
}

ImageTab.propTypes = {
    closeModal: PropTypes.func,
    addImagePost: PropTypes.func,
    currentUser: PropTypes.object,
    loadingHandler: PropTypes.func
}

const mapStateToProps = (state) => ({
    currentUser: state.user.currentUser,
})

const mapDispatchToProps = {
    addImagePost
}

export default connect(mapStateToProps, mapDispatchToProps)(ImageTab);

