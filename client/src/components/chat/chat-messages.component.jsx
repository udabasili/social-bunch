import  React from 'react';
import { RiCheckFill } from "react-icons/ri";

/**
  * @desc handles the styling of the messages being received and sent by user or in group
  * @param props messages being receiv details including type of message and time of being sent

*/

 const ChatMessenger = ({ 
     currentUser, 
     recipient = null,
     message 
    }) =>  {  

     let createdAt =  new Date(message.createdAt).toISOString(); 
    let timeSplit =  createdAt.split('T')[1].split('.')[0];
    let date = createdAt.split('T')[0];    
    
    const messageStatus = () =>{
        let status = null
        if (message.status === "sending") {
            status = <div className='sending'></div>
        }else {
            status = <RiCheckFill/>
        }
        return status;
    }


    return (
        <li className= {`clearfix ${  message.createdBy === currentUser._id ? 'right':' left'}`}>
            {
                (recipient && message.createdBy !== currentUser._id) &&
                    <img
                        src={recipient.userImage}
                        alt={recipient.username}
                    className="user__photo" />
                }
            <div className= {`message ${   message.createdBy === currentUser._id ? 'send-message': 'receive-message' }`}>
                {message.text}
            </div>
            <div 
                className= {`${  message.createdBy === currentUser._id ? 
                'right-date':' left-date'}`
            }>
                <span className='message-data-time' >
                    {date} {timeSplit} 
                </span> 
            </div>
            { message.createdBy === currentUser._id &&
                <div className='message-status'>
                    {messageStatus()}
                </div>
            }
        </li>
    )
}
            
 export default ChatMessenger