import  React from 'react';
import {connect} from 'react-redux';

/**
  * @desc handles the styling of the messages being received and sent by user or in group
  * @param props messages being received or sent with details including type of message and time of being sent
  * @author Udendu Abasili

*/

 const ChatMessenger = ({currentUser, message, location}) =>  {        
          
     let createdAt =  new Date(message.createdAt).toISOString(); 
    let timeSplit =  createdAt.split('T')[1].split('.')[0];
    let date = createdAt.split('T')[0];    

    return (
        <li className='clearfix'>
            <div 
                className= {`message-data ${  message.createdBy === currentUser.username ? 'sender-data'
                :' receive-data'}`}>
                <span className='message-data-name' >
                    {message.createdBy === currentUser.username ?
                        'Me' : message.createdBy
                    }
                </span> 
                <span className='message-data-time' >
                    {message.createdBy === currentUser.username && 
                        location
                    }
                </span>
                <span className='message-data-time' >
                    {date} {timeSplit} 
                </span>
            </div>
            <div className= {`message ${   message.createdBy === currentUser.username ? 'send-message'
            : 'receive-message' }`}>
                {message.text}
            </div>
        </li>
    )
}
            
const mapStateToProps = (state) =>({
    currentUser:state.user.currentUser
 })
 
 export default connect(mapStateToProps, null)(ChatMessenger)