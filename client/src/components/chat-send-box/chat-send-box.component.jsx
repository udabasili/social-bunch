import  React, {useState} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane, faPlaneArrival } from '@fortawesome/free-solid-svg-icons'
import {connect} from "react-redux";
import { sendMessageToGroup, sendMessageToPerson } from '../../services/socketIo';
import { sendMessage } from '../../redux/action/message.action';


/**
  * @desc handles the sending of message to groups or individuals based  props passed
  * @return bool - success or failure
  * @author Udendu Abasili

*/

const ChatSendBox = ({groupId, recipient, currentUser, sendMessage, getMessage, location}) =>  {    

    const [message, setMessage] = useState("") 
    //Submit message to either the group or user based on the props passed
    const onSubmitHandler = (e) =>{
        e.preventDefault()            
        let date = new Date();        
        if(groupId){ //to group
            sendMessageToGroup(message, groupId)
            console.log(message, groupId);
            
        }
        else if (recipient){ //to individual            
            let body = {message, location}
            //send message though io
            sendMessageToPerson(message, currentUser.username,  recipient.username, location)
            //send message to save in server
            sendMessage(recipient._id, body)
            
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
                
                className="chat-box__input chat_message" required/>
            
        </form>
    )
}

const mapStateToProps = (state) =>({
    currentUser:state.user.currentUser
 })

 const mapDispatchToProps = (dispatch) =>({
    sendMessage: (message, receiverId) => dispatch(sendMessage(message, receiverId))
 })
 
 export default connect(mapStateToProps, mapDispatchToProps)(ChatSendBox)
