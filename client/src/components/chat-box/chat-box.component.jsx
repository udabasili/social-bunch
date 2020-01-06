import  React, {useState} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { sendMessageToGroup, sendMessageToPerson, sendMessage} from "../../nodeserver/node.utils";
import {connect} from "react-redux";

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
        
        if(groupId){ //to group
            sendMessageToGroup(message, groupId)
            getMessage({
                text:message, 
                createdAt: date.toISOString(),
                createdBy:currentUser.username,
            })
        }
        else if (recipient){ //to individual            
            sendMessageToPerson(message, currentUser.username, recipient.friend.username)
            sendMessage(message, recipient.friend._id)
            getMessage({
                text:message, 
                createdAt: date.toISOString(),
                createdBy:currentUser.username,
            })
        }
        else{
            alert("Must click on a friend icon or be in a group to send message")
        }           
       
        setMessage("")
    }

    return(
        <form onSubmit={onSubmitHandler} className="chat-box">
            <input 
                type="text" 
                className="chat-box__input" 
                onChange={(e)=>setMessage(e.target.value)}
                value={message}
                placeholder="Chat..." required/>
            <button type="submit" className="chat-box__submit">
                <FontAwesomeIcon  icon={faPaperPlane}/>
            </button>
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
