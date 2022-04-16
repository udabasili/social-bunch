import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { GrView, GrFormClose } from 'react-icons/gr';
import { AiOutlineUserAdd } from 'react-icons/ai';
import { useAuth } from '@/lib/auth';
import { UserAttributes } from '@/features/user/types';
import { useFriend } from '@/features/user/api/friend';
import UserSummary from './UserSummary';

type UsersProps = {
    filteredUsers: Array<UserAttributes>
}

const Users = ({ 
    filteredUsers=[], 
    }: UsersProps) => {

    const [showAllUsers, showAllUsersHandler] = useState(true)
    const [selectedUser, setSelectedUser] = useState('')
    const {currentUser} = useAuth()
    const {addFriend, removeFriend} = useFriend()

    const viewProfile = (userId: string) => {
        setSelectedUser(userId)
        showAllUsersHandler(false)
    }


    const showAddButton = (userId: string) => {

        const getFriendsLength = currentUser.friends?.filter((friend) => {
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
        else if (currentUser.uid !== userId ){
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
                                        {showAddButton(user.uid)}
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


export default Users
