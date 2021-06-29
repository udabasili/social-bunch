import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { setReadMessages } from '../../redux/message/message.action';
import { firebaseConnect } from 'react-redux-firebase'
import { compose } from 'redux';


const UserList = ({
    users,
    selectUserHandler,
    setReadMessages,
    currentUser,
    unReadMessages,
    onlineUsers
    }) => {

    const unReadMessagesPerUser = (userId) => {
        let result = unReadMessages.filter((message) => (
            message.otherUserId === userId
        ))
        if(result.length === 1) {
            return result[0].unReadMessagesCount
        } else {
            return 0
        }
    }

    const checkOnlineUser = (userId) => {
        return onlineUsers.includes(userId)
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
                        <img 
                            src = {
                                user.image || "https://img.icons8.com/ios/50/000000/user-male-circle.png"
                            }
                            alt={user.username}/>
                        <span className={`
                            online-status 
                            ${ checkOnlineUser(user._id) ? "online": "offline"}
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

const mapStateToProps = (state, ownProps) => {
    const data = state.firestore.data.allUsers;
    const presence = state.firebase.data.presence;
    const messages = state.firebase.data.messages;
    const currentUserId = ownProps.currentUser._id;
    let unReadMessages = []
    const onlineUsers = [];
    let currentUserMessageIds = '';
    if (messages) {
        const objKeys = Object.keys(messages)
        currentUserMessageIds = objKeys.filter(item => item.includes(currentUserId))
        let eachUnreadMessage = []
        unReadMessages = currentUserMessageIds.map((id) => {
            let message = messages[id]
            for (let key in message) {
                if (message[key].createdBy !== currentUserId && !message[key].read) {
                        eachUnreadMessage.push(message[key])
                }
            } 
            let unReadMessagesCount = eachUnreadMessage.length
            const otherUserId = id.split('_').filter(item => !item.includes(currentUserId))[0]
            return {
                unReadMessagesCount,
                otherUserId

            }
        })
    }
    if (presence) {
        for (let key in presence) {
            onlineUsers.push(key)
        }

    }


    let users = [];
    if (data) {
        for (let key in data) {
            users.push({
                _id: key,
                ...data[key]
            })
        }

        
    }
    return {
        users,
        onlineUsers,
        unReadMessages,
}}

const mapDispatchToProps = {
    setReadMessages
}

export default compose(
    firebaseConnect([
        'presence' // sync /todos from firebase into redux
    ]),
	connect(mapStateToProps, mapDispatchToProps)
)(UserList);

