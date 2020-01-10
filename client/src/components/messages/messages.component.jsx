import React, {useEffect, useState} from 'react';
import UserIcon from "../user-icon-status/user-icon-status";
import {connect} from "react-redux";
import { socket } from '../../services/socketIo';


/**
  * @desc show messages sent by friends
  * friends list to User Icon as props
  * @param props for the toggle button of showing and hiding profile window and current user from redux
  * @author Udendu Abasili

*/

function Messages(props) {
    
    const [onlineFriends, setOnlineFriends] = useState([])  
//Get the list of online friends from the server and map through the list of friends to show status
    useEffect(() => {
        const interval = setInterval(() => {
          socket.emit("getOnlineFriends",props.currentUser.username, (response)=>{            
              setOnlineFriends(response)
     
           })
        }, 2000);
        return () => clearInterval(interval);
      }, []);

    return (
        <div className="messages">
            {props.currentUser.friends.map((friend, i)=>(
                friend.messages  ? 
                    <div key={i} onClick={()=>props.showMessages(friend.messages, {friend:{
                           image: friend.userInfo.userImage,
                            ...friend.userInfo}} 
                            )} 
                          className="message">
                        <div className="message__image">
                            <UserIcon 
                                imageUri={`data:image/png;base64,${friend.userInfo.userImage}`}
                                username = {friend.userInfo.username} 
                                onlineUsers = {onlineFriends}
                                />
                        </div>
                        <div className="message__content">
                            <h2 className="secondary-header">{friend.userInfo.username}</h2>
                            <p className="message__content__count">{`${friend.messages.length} messages`}</p>
                        </div>
                        <hr/>
                    </div>
                    :
                <div></div>
                ))
                }
            </div>
    )
}
const mapStateToProps = (state) =>({
    currentUser:state.user.currentUser
 })
 
 export default connect(mapStateToProps, null)(Messages)
