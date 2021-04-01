import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { GrView, GrFormClose } from 'react-icons/gr';
import { AiOutlineUserAdd } from 'react-icons/ai';
import { BiSearch } from "react-icons/bi";
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
            return userId === friend._id
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
        } 
    }
    

    return (
        <div className="users">    
            {
                showAllUsers ? (
                    <React.Fragment>
                        {/* <div className="users__search-box">
                            <input 
                                type="search"  
                                placeholder={`Search for ${ type }...`} 
                                className="users__search" />
                            <BiSearch className="users__icon"/>
                        </div> */}
                        <ul className="users__list">
                            {
                                filteredUsers.map((user) => (
                                    <li className="users__item">
                                        <div className="avatar">
                                            <img src={user.userImage} alt={user.username} />
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

const mapStateToProps = (state) => ({
    users: state.users.allUsers,
    currentUser: state.user.currentUser
})

const mapDispatchToProps = {
    addFriend,
    removeFriend
}

export default connect(mapStateToProps, mapDispatchToProps)(Users)
