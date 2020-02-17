import React, {useEffect, useState} from 'react';
import UserIcon from "../user-icon-status/user-icon-status";
import {connect} from "react-redux";
import { socket } from '../../services/socketIo';


/**
  * @desc show past messages between a user and his friend
  * friends list to User Icon as props
  * @param props for the toggle button of showing and hiding profile window and current user from redux

*/

function UserMessageHistory(props) {
    
    const [onlineFriends, setOnlineFriends] = useState([])  
//Get the list of online friends from the server and map through the list of friends to show status
    useEffect(() => {
        const interval = setInterval(() => {
          socket.emit("getOnlineFriends",props.currentUser.username, (response)=>{            
              setOnlineFriends(response)
           })
        }, 100);
        return () => clearInterval(interval);
      }, []);

    return (
        <div className="messages">
            {props.currentUser.friends.map((friend, i)=>(
                friend.messages  ? 
                    <div key={i} onClick={()=>props.showMessages({
                           image: friend.userInfo.userImage,
                            ...friend.userInfo}
                            )} 
                          className="message">
                        <div className="message__image">
                            <UserIcon 
                                imageUri={friend.userInfo.userImage}
                                username = {friend.userInfo.username} 
                                onlineUsers = {onlineFriends}
                                />
                        </div>
                        <div className="message__content">
                            <h2 className="secondary-header">{friend.userInfo.username}</h2>
                            <p className="message__content__count">Show Messages</p>
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
 
 export default connect(mapStateToProps, null)(UserMessageHistory)
