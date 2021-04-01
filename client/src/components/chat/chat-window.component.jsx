import React, {useState} from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { BsPeopleCircle } from 'react-icons/bs';
import { AiOutlineSend } from 'react-icons/ai';
import Socket from '../../services/chat-client';
import ChatMessages from './chat-messages.component';
import { toast } from 'react-toastify';

const ChatWindow = ({
        user,
        currentUser,
        pushMessage,
        messages
    }) => {

    const [text, setText] = useState('')

    const showProfile = () => {
        const userProfileComponent = document.querySelector('#user-profile')
        userProfileComponent.classList.add('show-profile-component')
    }

    function generateChatId(sentUserId, currentUserId) {
        const keyArray = []
        keyArray.push(sentUserId)
        keyArray.push(currentUserId)
        keyArray.sort((a, b) => a - b)
        return keyArray.join('_')
    }

    function sendMessage(){
        if(text.length === 0 ){
            toast.error('Text box cannot be empty')
            return;
        }
        const chatId = generateChatId(
            user._id,
            currentUser._id
        )
        const data = {}
        data.from = currentUser._id;
        const message = {
            text,
            createdBy: currentUser._id,
            chatId,
            createdAt: Date.now(),
            updatedAt: Date.now()
        }
        pushMessage(message)
        data.message = message;
        data.to = user._id;
        setText('')
        const socket = new Socket()
        socket.sendPrivateMessageSender(data)
    }

    return (
        <div className="chat-window">
            <div className="chat-window__header">
                <div className="user">
                    <img 
                        src={user.userImage}
                        alt={user.username}
                        className="avatar"
                    />
                    <span  className="username">
                        {user.username}
                    </span>
                </div>
                <div className="icons">
                    <span
                        className="icon mobile-only"
                        title="View profile"
                        onClick={showProfile}
                    >
                        <BsPeopleCircle/>
                    </span>
                </div>
            </div>
            <div className="chat-window__body">
                {
                    messages.map((message, index) => (
                        <ChatMessages
                            currentUser={currentUser}
                            message={message}
                            key={message._id || index}
                            recipient={user}
                        />
                    ))
                }
            </div>
            <div className="chat-window__chat-box">
                <textarea
                    className="input"
                    placeholder="Start typing Message...."
                    onChange={ e => setText(e.target.value)}
                    value={text}
                    required
                />
                <span className="send">
                    <AiOutlineSend
                        title='Send'
                        onClick={sendMessage}
                        
                    />
                </span>
            </div>
        </div>
    )
}

ChatWindow.propTypes = {
    user: PropTypes.object
}

const mapStateToProps = (state) => ({
    currentUser: state.user.currentUser
})

const mapDispatchToProps = {
    
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatWindow)
