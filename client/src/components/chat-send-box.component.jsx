import  React, {useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane} from '@fortawesome/free-solid-svg-icons';
import {connect} from 'react-redux';
import { sendMessageToGroup } from '../services/socketIo';
import { sendMessage } from '../redux/action/message.action';
import { GrAddCircle } from "react-icons/gr";

/**
  * @desc handles the sending of message to groups or individuals based  props passed
  * if the prop passed is groupId , the message is sent to a group 
  * if user info is passed, the message is sent privately
  * @return null

*/

const ChatSendBox = ({groupId, recipient, currentUser, sendMessage, location}) =>  {    

    const [message, setMessage] = useState('') 

    const chatId = (sentUserId, currentUserId) => {
        const keyArray = []
        keyArray.push(sentUserId)
        keyArray.push(currentUserId)
        keyArray.sort()
        return keyArray.join('_')
    }

    const onSubmitHandler = (e) =>{
        e.preventDefault()  
        if(groupId){ 
            sendMessageToGroup(message, groupId)            
        }
        else if (recipient){
            let id = chatId(recipient._id, currentUser._id) 
            let body = { message, location, chatId: id }         
            sendMessage(recipient._id, body)
            
        }
        else{
            alert('Click on a friend icon or join in a group to send message')
        }           
       
        setMessage('')
    }

    return(
        <form onSubmit={onSubmitHandler} className='chat-box'>
            <input type='hidden' value='something'/>
            <button className='chat-box__icon add'>
                <GrAddCircle />
            </button>
            <input 
                type='text'
                name='chat_message' 
                onChange={(e)=>setMessage(e.target.value)}
                autoComplete='new-password'
                value={message}
                
                placeholder='Send a message' 
                className='chat-box__input chat_message' required/>
            <button type='submit' className='chat-box__icon submit'>
                <FontAwesomeIcon icon={faPaperPlane} />
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
 
 export default connect(mapStateToProps, mapDispatchToProps)(ChatSendBox)
