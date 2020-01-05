import React from 'react'

const ChatArea = (props) => (
    <div className="chat-area">
        <ul className="inner">
            {props.children}
        </ul>
    </div>
)


export default ChatArea