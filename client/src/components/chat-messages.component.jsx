import  React, { useEffect, useState } from 'react';
import {connect} from 'react-redux';
import { RiCheckDoubleFill } from "react-icons/ri";
import { RiCheckFill } from "react-icons/ri";
import { RiErrorWarningLine } from "react-icons/ri";


/**
  * @desc handles the styling of the messages being received and sent by user or in group
  * @param props messages being received or sent with details including type of message and time of being sent
  * @author Udendu Abasili

*/

 const ChatMessenger = ({currentUser, message, recipient=null, messagingStatus='sending'}) =>  {  

    const [currentMessagingStatus, setCurrentMessagingStatus] = useState(messagingStatus)
    useEffect(() => {
        setCurrentMessagingStatus(message.status)
        
    }, [message])
     let createdAt =  new Date(message.createdAt).toISOString(); 
    let timeSplit =  createdAt.split('T')[1].split('.')[0];
    let date = createdAt.split('T')[0];    

    
    const messageStatus = () =>{
        let status = null
        if(currentMessagingStatus === "sending"){
            status = <div className='sending'></div>
        }else if (currentMessagingStatus === "sent"){
            status = <RiCheckFill/>
        }
        else if (currentMessagingStatus === "delivered"){
            status = <RiCheckDoubleFill/>
        }
        else if (currentMessagingStatus === "error"){
            status = <RiErrorWarningLine/>
        }
        return status;
    }

    const imageAttached = message.image
    return (
        <li className= {`clearfix ${  message.createdBy === currentUser.username ? 'right':' left'}`}>
                {
                    (recipient && message.createdBy !== currentUser.username)&&
                    <img
                        src={recipient.image || recipient.userImage}
                    alt="your profile"
                    className="user__photo" />
                }
            <div className= {`message ${   message.createdBy === currentUser.username ? 'send-message': 'receive-message' }`}>
                {message.text}
            </div>
            {imageAttached &&
                <div className= {`image ${   message.createdBy === currentUser.username ? 'send-message': 'receive-message' }`}>
                    <img src={imageAttached} alt='attached-image' />
                </div>
            }
            <div 
                className= {` ${  message.createdBy === currentUser.username ? 'right-date':' left-date'}`}>
                <span className='message-data-time' >
                    {date} {timeSplit} 
                </span> 
            </div>
            
            { message.createdBy === currentUser.username &&
                <div className='message-status'>
                    {messageStatus()}
                </div>
            }
            </li>
    )
}
            
const mapStateToProps = (state) =>({
    currentUser:state.user.currentUser
 })
 
 export default connect(mapStateToProps, null)(ChatMessenger)