import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { IoCloseCircleSharp } from 'react-icons/io5';

const UserProfile = ({ user }) => {
    
    const hideProfile = () => {
        const userProfileComponent = document.querySelector('#user-profile')
        userProfileComponent.classList.remove('show-profile-component')
    }

    return (
        <div className="user-summary user-profile" id='user-profile'>
            <div className="user-summary__button">
                <IoCloseCircleSharp onClick={hideProfile}/>
            </div>
            { user && (
                <div className="user-summary__user">
                    <img 
                        src={user.image} 
                        className="user-photo"
                        alt={user.username}/>
                    <span className="username">
                        {user.username}
                    </span>
                </div>
                ) }
        </div>
    )
}

UserProfile.propTypes = {
    user: PropTypes.object
}



export default UserProfile;
