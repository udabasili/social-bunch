import React from 'react';

/**
  * @desc handles the main container for the messages user sends and receives
*/

const ChatArea = (props) => (
    <div className="chat-area">
        {props.children}
    </div>
)


export default ChatArea