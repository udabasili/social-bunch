import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { setReadMessages } from '../../redux/message/message.action'

const UserList = ({
    users,
    selectUserHandler,
    setReadMessages,
    currentUser,
    unReadMessages
    }) => {

    const unReadMessagesPerUser = (userId) => {
        return unReadMessages.filter((message) => (
            message.createdBy === userId
        )).length
    }

    const onClickEvent = (user) => {
        setReadMessages(user._id);
        selectUserHandler(user)
    }

    return (
        <div className="user-list">
            {
                users.filter((user) => currentUser._id !== user._id).map((user) => (
                    <div className="avatar-icon" 
                        key={user._id}
                        onClick={() => {
                            onClickEvent(user)
                        }}
                    >
                        <img src={user.userImage} alt={user.username}/>
                        <span className={`
                            online-status 
                            ${ user.socketId ? "online": "offline"}
                        `}/>
                        {
                            unReadMessagesPerUser(user._id) > 0 && (
                                <span className={`messages `}>
                                    { unReadMessagesPerUser(user._id) }
                                </span>
                            )
                        }
                        
                    </div>
                ))
            }
        </div>
    )
}

UserList.propTypes = {
    users: PropTypes.array
}

const mapStateToProps = (state) => ({
    users: state.users.allUsers,
    unReadMessages: state.messages.unReadMessages,
    currentUser: state.user.currentUser
})

const mapDispatchToProps = {
    setReadMessages
}

export default connect(mapStateToProps, mapDispatchToProps)(UserList)
