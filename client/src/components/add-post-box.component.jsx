import React, { useState } from 'react';
import AddPost from './add-post.component';
import Modal from './modal.component';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

/**
 *
 * The input box in the homepage
 * @param {object} {currentUser}
 * @return {JSX} 
 */
function AddPostBox({currentUser}) {

    const [showModal, setShowModal] = useState(false)

    return (
        <React.Fragment>
            { showModal && (
                <Modal>
                    <AddPost closeModal={() => setShowModal(false)}/>
                </Modal>
            )}
            <div className="add-post-box">
                <div className="avatar">
                    <img 
                        src={currentUser.userImage} 
                        alt={currentUser.username}
                    />
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

const mapStateToProps = (state) => ({
    currentUser: state.user.currentUser
})

export default connect(mapStateToProps, null)(AddPostBox);