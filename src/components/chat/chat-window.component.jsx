import React, {useState, useEffect, useRef} from 'react'
import PropTypes from 'prop-types'
import { BsPeopleCircle } from 'react-icons/bs';
import { AiOutlineSend } from 'react-icons/ai';
import ChatMessages from './chat-messages.component';
import { toast } from 'react-toastify';
import { useFirebase } from 'react-redux-firebase';
import { setReadMessages } from '../../redux/message/message.action';
import { connect } from 'react-redux'

const ChatWindow = ({
        user,
        currentUser,
        setReadMessages,
        pushMessage,
        messages
    }) => {
    
    const chatMessageArea = useRef()
    const currentSender = useRef(null)

    useEffect(() => { 
      chatMessageArea.current.scrollTop = chatMessageArea.current.scrollHeight;
      if (!currentSender.current) {
            setReadMessages(user._id)
      }
    }, [messages])

    const [text, setText] = useState('');
    const firebase = useFirebase()

    const showProfile = () => {
        const userProfileComponent = document.querySelector('#user-profile')
        userProfileComponent.classList.add('show-profile-component')
    }

    function generateChatId(sentUserId, currentUserId) {
        const keyArray = []
        keyArray.push(sentUserId)
        keyArray.push(currentUserId)
        keyArray.sort()
        return keyArray.join('_')
    }

    function sendMessage(){
        const chatId = generateChatId(
            user._id,
            currentUser._id
        )
        const messageRef = firebase.ref('messages').child(chatId);
        if(text.length === 0 ){
            toast.error('Text box cannot be empty')
            return;
        }
        
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
        currentSender.current = currentUser._id
        messageRef.push({
            ...message,
            status: 'delivered',
            read: false
        })
    }

    return (
        <div className="chat-window">
            <div className="chat-window__header">
                <div className="user">
                    <img 
                        src={user.image}
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
            <div className="chat-window__body" ref={chatMessageArea}>
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
    user: PropTypes.object,
    currentUser: PropTypes.object,
    pushMessage: PropTypes.func,
    messages: PropTypes.func
}

const mapStateToProps = (state) => ({
    currentUser: state.user.currentUser,
})

const mapDispatchToProps = {
    setReadMessages
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatWindow);
