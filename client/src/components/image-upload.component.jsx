import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { uploadImage } from '../redux/user/user.action';
import { toast } from 'react-toastify';
import Loading from './loader.component';

const ImageUpload = ({
    handleAuthenticationStep,
    uploadImage,
    currentUser
    }) => {
    const [imageData, setImage] = useState({
        imageName: '',
        imageUrl: ''
    })
    const [imageUploaded, setImageUploaded] =  useState(false)
    const [submitting, setSubmitting] = useState(false)
    function upload() {
        const currentImage = {...imageData}
        const imageInput = document.querySelector('.image-upload__input');
        imageInput.click();
        imageInput.onchange = function(e){
            if(Object.keys(e.target.files).length > 0){
                const imageName = e.target.value.split('\\')[e.target.value.split('\\').length - 1]
                currentImage.imageName = imageName;
                currentImage.imageUrl = e.target.files[0]
                setImage(currentImage)
                setImageUploaded(true)
            }
        }
    }

    function submitImage () {
        if(!imageUploaded){
            toast.error('You must upload an image')
            return
        }
        setSubmitting(true)
        const form = new FormData()
        form.append('image', imageData.imageUrl)
        const userId = currentUser._id
        uploadImage(form, userId)
        .then(() => {
            setSubmitting(false)
            handleAuthenticationStep('user-info')
        })
        .catch((e) => {
            setSubmitting(false)
        })
    }

    return (
        <div className="register image-upload">
            {submitting && <Loading/>}
            <input type="file" accept="image/*" className="image-upload__input"/>
            {
                !imageUploaded ? 
                <React.Fragment>
                    <button className="button button--wide" onClick={upload}>
                        Upload Profile Image
                    </button>
                </React.Fragment>:
                <React.Fragment>
                     <div className="image-upload__avatar">
                        <img alt='profile' src={URL.createObjectURL(imageData.imageUrl)}/>
                    </div>  
                    <div className="image-upload__buttons">
                         <button 
                            onClick={upload}
                            className="button button--submit edit">
                            Edit
                        </button>
                         <button 
                            onClick={submitImage}
                            className="button button--submit">
                            Submit
                        </button>
                    </div>
                   
                </React.Fragment>
                
            }
              
        </div>
    )
}

ImageUpload.propTypes = {
    handleAuthenticationStep: PropTypes.func,
    uploadImage: PropTypes.func,
    currentUser: PropTypes.object
}

const mapStateToProps = (state) => ({
    currentUser: state.user.currentUser
})

const mapDispatchToProps = {
    uploadImage
}

export default connect(mapStateToProps, mapDispatchToProps)(ImageUpload)
