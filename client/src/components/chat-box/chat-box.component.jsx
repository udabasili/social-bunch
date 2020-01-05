import  React, {useState} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFastForward, faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { sendMessageToGroup} from "../../nodeserver/node.utils";
import {connect} from "react-redux";

const ChatBox = (props) =>  {    

        const [message, setMessage] = useState("")    

        const onSubmitHandler = (e) =>{
            e.preventDefault()            
            let date = new Date();
            if(props.groupId){
                sendMessageToGroup(message, props.groupId)
            }            
            props.getMessage({
                message:message, 
                dateTime: date.toISOString(),
                currentUser:props.currentUser.username,
                type:"send"
            })
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
 
 export default connect(mapStateToProps, null)(ChatBox)
