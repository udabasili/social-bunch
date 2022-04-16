import React from 'react'
import PropTypes from 'prop-types'
import { IoCloseCircleSharp } from 'react-icons/io5';
import { UserAttributes } from '@/features/user/types';

interface Props {
  user: UserAttributes
}
const ChatUserProfile = ({ user }: Props) => {
    
    const hideProfile = () => {
        const userProfileComponent = document.querySelector<HTMLDivElement>('#user-profile')
        userProfileComponent?.classList.remove('show-profile-component')
    }

    return (
        <div className="user-summary user-profile" id='user-profile'>
            <div className="user-summary__button">
                <IoCloseCircleSharp onClick={hideProfile}/>
            </div>
            { user && (
                <div className="user-summary__user">
                    <img 
                        src = {
                            user.image || "https://img.icons8.com/ios/50/000000/user-male-circle.png"
                        }
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

ChatUserProfile.propTypes = {
    user: PropTypes.object
}



export default ChatUserProfile;
