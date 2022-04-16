
import Modal from '@/components/Modal/Modal';
import { useAuth } from '@/lib/auth';
import PropTypes from 'prop-types';
import React from 'react';
import { useState } from 'react';
import AddPost from './AddPost';
import Skeleton from 'react-loading-skeleton'


function AddPostBox() {

    const [showModal, setShowModal] = useState(false)
    const { currentUser } = useAuth()
    const [imageLoading, setImageLoading] = useState(true)

    return (
        <React.Fragment>
            { showModal && (
                <Modal>
                    <AddPost 
                        closeModal={() => setShowModal(false)}
                    />
                </Modal>
            )}
            <div className="add-post-box">
                <div className="avatar">
                <>
                            {
                                imageLoading && (
                                    <Skeleton
                                        height="100%"
                                        duration={1}
                                        containerClassName="avatar-skeleton"
                                    />
                                )
                            }
                            <img 
                                src={
                                    currentUser.image || "https://img.icons8.com/ios/50/000000/user-male-circle.png"
                                }
                                alt={currentUser.username}
                                loading="lazy"
                                onLoad={() => setImageLoading(false)}
                            />
                
                            </>

                  
                </div>
                <input 
                    type="text" 
                    onClick={() => setShowModal(true)}
                    readOnly={true}
                    value=''
                    placeholder="What is on your mind?" 
                    className="add-post-box__input"
                />
            </div>
        </React.Fragment>
        
    )
}

AddPostBox.propTypes = {
    currentUser: PropTypes.object,
}

export default AddPostBox