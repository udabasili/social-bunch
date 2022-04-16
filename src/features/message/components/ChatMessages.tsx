import  React from 'react';
import { RiCheckFill } from "react-icons/ri";
import { BiCheckDouble } from "react-icons/bi";
import { useAuth } from '@/lib/auth';
import { MessageAttributes } from '../type';
import { UserAttributes } from '@/features/user/types';

/**
  * @desc handles the styling of the messages being received and sent by user or in group
  * @param props messages being receiv details including type of message and time of being sent

*/


type ChatMessengerProps = {
    recipient?: UserAttributes | null
    message: MessageAttributes
}
 const ChatMessenger = ({ 
     recipient = null,
     message 
    }: ChatMessengerProps) =>  {  

     let createdAt =  new Date(message.createdAt).toISOString(); 
    let timeSplit =  createdAt.split('T')[1].split('.')[0];
    let date = createdAt.split('T')[0];    
    const { currentUser } = useAuth()
    
    const messageStatus = () => {
        let status = null
        if (message.status === "sending") {
            status = <div className='sending'></div>
        } else if (message.status === "delivered" && message.read) {
            status = <BiCheckDouble/>
        }
        else {
            status = <RiCheckFill/>
        }
        return status;
    }


    return (
        <li className= {`clearfix ${  message.createdBy === currentUser.uid ? 'right':' left'}`}>
            {
                (recipient && message.createdBy !== currentUser.uid) &&
                    <img
                        src = {
                            recipient.image || "https://img.icons8.com/ios/50/000000/user-male-circle.png"
                        }
                        alt={recipient.username}
                    className="user__photo" />
                }
            <div className= {`message ${   message.createdBy === currentUser.uid ? 'send-message': 'receive-message' }`}>
                {message.text}
            </div>
            <div 
                className= {`${  message.createdBy === currentUser.uid ? 
                'right-date':' left-date'}`
            }>
                <span className='message-data-time' >
                    {date} {timeSplit} 
                </span> 
            </div>
            { message.createdBy === currentUser.uid &&
                <div className='message-status'>
                    {messageStatus()}
                </div>
            }
        </li>
    )
}
            
 export default ChatMessenger