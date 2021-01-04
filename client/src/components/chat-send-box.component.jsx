import  React, {useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane} from '@fortawesome/free-solid-svg-icons';
import {connect} from 'react-redux';
import { sendMessageToGroup } from '../services/socketIo';
import { sendMessage } from '../redux/action/message.action';
import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'
import 'emoji-mart/css/emoji-mart.css'
import { GrEmoji } from "react-icons/gr";

/**
  * @desc handles the sending of message to groups or individuals based  props passed
  * if the prop passed is groupId , the message is sent to a group 
  * if user info is passed, the message is sent privately
  * @return null

*/

const ChatSendBox = ({groupId, 
        recipient, 
        currentUser, 
        sendMessage, 
        location, 
        image=null, 
        appendInput= f => f}) =>  {    

    const [showEmoji, setShowEmoji] = useState(false)  
    const [message, setMessage] = useState('') 

    

    const showEmojiHandler = (e) =>{
         e.preventDefault()
        setShowEmoji(!showEmoji)
    }
    const handleEmojiSelect = (emoji) => {
        let currentString = message
        currentString = currentString.concat(emoji.native)
        setMessage(currentString)
    }
    const chatId = (sentUserId, currentUserId) => {
        const keyArray = []
        keyArray.push(sentUserId)
        keyArray.push(currentUserId)
        keyArray.sort()
        return keyArray.join('_')
    }

    const setMessageHandler =(e) =>{
        setShowEmoji(false)
        setMessage(e.target.value)

    }

    const onSubmitHandler = (e) =>{
        e.preventDefault()  
        appendInput({
            text: message,
            createdBy: currentUser.username,
            image: image ?  URL.createObjectURL(image) : null,
            chatId,
            status:'sending',
            createdAt: Date.now(),
            updatedAt: Date.now()
        })
        setShowEmoji(false)
        if(groupId){ 
            sendMessageToGroup(message, groupId)            
        }
        else if (recipient){
             
           
            let id = chatId(recipient._id, currentUser._id) 
            let body = { message, location, chatId: id }   
            if(image){
                 let headers = {
                    'content-type' :'application/json'
                }
                 const form = new FormData()
                const data = JSON.stringify(body)
                form.append('image', image)
                form.append('info', data)
                sendMessage(recipient._id, form, headers)
            }else{
                let headers = {
                    'content-type': 'multipart/form-data'
                }

                sendMessage(recipient._id, body, headers)
                
            }
            
            
        }
        else{
            alert('Click on a friend icon or join in a group to send message')
        }           
       
        setMessage('')
    }

    return(
        <form onSubmit={onSubmitHandler} className='chat-box'>
            {showEmoji &&
                <div className='chat-box__popup' >
                    <Picker onSelect={handleEmojiSelect} />
                </div>
            }
            
            <input type='hidden' value='something'/>
            <button className='chat-box__icon add'onClick={showEmojiHandler}>
                <GrEmoji />
            </button>
            <input 
                type='text'
                name='chat_message' 
                onChange={setMessageHandler}
                autoComplete='new-password'
                value={message}
                
                placeholder='Send a message' 
                className='chat-box__input chat_message' required/>
            <button type='submit' className='chat-box__icon submit' >
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
