import  React from 'react';
import {connect} from "react-redux";

/**
  * @desc handles the styling of the messages being received and sent by user or in group
  * @param props messages being received or sent with details including type of message and time of being sent
  * @author Udendu Abasili

*/

 const ChatMessenger = ({currentUser, message, location}) =>  {    
    console.log(message);
    
    // let timeSplit =  message.createdAt.split("T")[1].split(":");
    // let date = message.createdAt.split("T")[0].split("-");

    return (
        <li className="clearfix">
            <div 
                className= {`message-data ${  message.createdBy === currentUser.username ? "sender-data"
                :" receive-data"}`}>
                <span className="message-data-name" >
                    {message.createdBy === currentUser.username ?
                        "Me" : message.createdBy
                    }
                </span> 
                <span className="message-data-time" >
                    {message.createdBy === currentUser.username &&
                        location}
                </span>
                <span className="message-data-time" >
                </span> &nbsp; &nbsp;
                <span className="message-data-time" >
                </span> &nbsp; &nbsp;
            </div>
            <div className= {`message ${   message.createdBy === currentUser.username ? "send-message"
            : "receive-message" }`}>
                {message.text}
            </div>
        </li>
    )
}
            
const mapStateToProps = (state) =>({
    currentUser:state.user.currentUser
 })
 
 export default connect(mapStateToProps, null)(ChatMessenger)