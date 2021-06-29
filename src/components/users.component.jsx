import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { GrView, GrFormClose } from 'react-icons/gr';
import { AiOutlineUserAdd } from 'react-icons/ai';
import UserSummary from './user-summary.component'
import { addFriend, removeFriend } from '../redux/user/user.action';

const Users = ({ 
    filteredUsers=[], 
    type,
    addFriend,
    currentUser,
    removeFriend
    }) => {

    const [showAllUsers, showAllUsersHandler] = useState(true)
    const [selectedUser, setSelectedUser] = useState(null)

    const viewProfile = (userId) => {
        setSelectedUser(userId)
        showAllUsersHandler(false)
    }

    const showAddButton = (userId) => {
        const getFriendsLength = currentUser.friends.filter((friend) => {
            return userId === friend
        }).length 

        if (getFriendsLength !== 0) {
            return (
                <div className="users__buttons">
                    <div className="users__button">
                        <GrView onClick={() => viewProfile(userId)}/>
                    </div>
                    <div className="users__button remove">
                        <GrFormClose  onClick={() => removeFriend(userId)}/>
                    </div>
                </div>
            )
        }
        else if (currentUser._id !== userId ){
            return (
                <div className="users__buttons">
                    <div className="users__button">
                        <GrView onClick={() => viewProfile(userId)}/>
                    </div>
                    <div className="users__button">
                        <AiOutlineUserAdd  onClick={() => addFriend(userId)}/>
                    </div>
                </div>
            )
        } else {
            return null;
        } 
    }
    

    return (
        <div className="users">    
            {
                showAllUsers && currentUser ? (
                    <React.Fragment>
                        <ul className="users__list">
                            {
                                filteredUsers
                                .map((user) => (
                                    <li className="users__item">
                                        <div className="avatar">
                                            <img src={
                                                user.image || "https://img.icons8.com/ios/50/000000/user-male-circle.png"
                                                } alt={user.username} />
                                        </div>
                                        <span className="username">
                                            {user.username}
                                        </span>
                                        {showAddButton(user._id)}
                                    </li>
                                ))
                            }
                        </ul> 
                    </React.Fragment> 
                )   :
                selectedUser && (
                     <UserSummary
                        selectedUser={selectedUser}
                        showAllUsers={showAllUsersHandler}
                    />
                )
            }
        </div>
    )
}

Users.propTypes = {
    type: PropTypes.string,
    filteredUsers: PropTypes.array
}


const mapDispatchToProps = {
    addFriend,
    removeFriend
}

export default connect(null, mapDispatchToProps)(Users)
