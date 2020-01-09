import  React, {useState} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane, faPlaneArrival } from '@fortawesome/free-solid-svg-icons'
import {connect} from "react-redux";
import { sendMessageToGroup, sendMessageToPerson } from '../../services/socketIo';
import { sendMessage } from '../../redux/action/user.action';

/**
  * @desc handles the sending of message to groups or individuals based  props passed
  * @return bool - success or failure
  * @author Udendu Abasili

*/

const ChatBox = ({groupId, recipient, currentUser, sendMessage, getMessage}) =>  {    

    const [message, setMessage] = useState("") 

    //Submit message to either the group or user based on the props passed
    const onSubmitHandler = (e) =>{
        e.preventDefault()            
        let date = new Date();
        console.log(message, groupId);
        
        if(groupId){ //to group
            sendMessageToGroup(message, groupId)
            getMessage({
                text:message, 
                created_at : date,
                createdBy:currentUser.username,
            })
        }
        else if (recipient){ //to individual            
            sendMessageToPerson(message, currentUser.username, recipient.friend.username)
            sendMessage(message, recipient.friend._id)
            getMessage({
                text:message, 
                createdAt: date,
                createdBy:currentUser.username,
            })
        }
        else{
            alert("Click on a friend icon or join in a group to send message")
        }           
       
        setMessage("")
    }

    return(
        <form onSubmit={onSubmitHandler} className="chat-box">
            <button  type="submit" className="chat-box__icon">
                <FontAwesomeIcon icon={faPaperPlane}/>  </button>
            <input 
                type="text"
                name="chat_message" 
                onChange={(e)=>setMessage(e.target.value)}
                value={message}
                placeholder="Send a message" 
                class="chat-box__input chat_message" required/>
            
        </form>
    )
}

const mapStateToProps = (state) =>({
    currentUser:state.user.currentUser
 })

 const mapDispatchToProps = (dispatch) =>({
    sendMessage: (message, receiverId) => dispatch(sendMessage(message, receiverId))
 })
 
 export default connect(mapStateToProps, mapDispatchToProps)(ChatBox)
