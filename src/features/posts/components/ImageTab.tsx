import { Button } from '@/components/Elements';
import React, { useState } from 'react';
import { BsFillPlusCircleFill } from 'react-icons/bs';
import { FaTimesCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useCreatePost } from '../api/createPost';
import Compressor from 'compressorjs';

interface Props {
    closeModal: (e: boolean) => void
    loadingHandler: (e: boolean) => void
    isLoading: boolean

}
function ImageTab({ 
    closeModal,
    loadingHandler,
    isLoading
    }: Props) {

    const [ImageUploaded, setImageUploaded] = useState(false)
    const [ImageUrls, setImageUrls] = useState<Array<File | string | Blob>>([])
    const {createImagePostFn} = useCreatePost()
    const [title, setTitle] = useState('')

    const uploadImage = () => {
        let currentImages = [...ImageUrls];
        currentImages = currentImages.filter((image) => (
            image !== ""
        ))
        const imageUpload = document.querySelector<HTMLInputElement>(".image-upload");
        if (imageUpload){
            imageUpload?.click();
            imageUpload.onchange = function(e){
                const target = e.target as HTMLInputElement
                if (target.files && target?.files[0] !== undefined){
                    const file = target.files[0];
                    new Compressor(file, {

                        quality: 0.3,
                        success(result) {
                            console.log(result, file)
                            currentImages.push(result);
                            currentImages.push("");
                            setImageUrls([...currentImages]);
                            setImageUploaded(true);
                        }
                    })
                    
                }
                
            }
        }
       
    }

    const closeButton = (e: any) => {
        let currentImages = [...ImageUrls]
        let id  = e.target.parentNode.id || e.target.parentNode.parentNode.id;
        const currentIndex = id.split("-")[1];
        currentImages = currentImages.filter((image, i) => (
            i !== Number(currentIndex)
        ))
        setImageUrls([...currentImages]);
    }

    const submitHandler = () =>{
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
        createImagePostFn({files: currentImages as  File[], title})
            .then(() => {
                loadingHandler(false)
                closeModal(true)
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
                    <Button 
                    type='button'
                    size="lg"
                    variant="primary"
                    onClick={uploadImage}
                    >
                        Upload
                </Button>
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
                                <img  alt={`upload-${index}`} src={URL.createObjectURL(image as File)}/>
                                <FaTimesCircle 
                                    onClick={closeButton}
                                    className="remove-image"/>
                            </div>
                        ))
                    }
                </div>
            }
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
                    onClick={submitHandler}
                    >
                        Submit
                </Button>
            </div>
        </div>
    )
}


export default ImageTab

