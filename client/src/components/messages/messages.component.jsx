import React from 'react';
import UserIcon from "../user-icon-status/user-icon-status";
import {connect} from "react-redux";

/**
  * @desc show messages sent by friends
  * friends list to User Icon as props
  * @param props for the toggle button of showing and hiding profile window and current user from redux
  * @author Udendu Abasili

*/
function Messages(props) {
    console.log(props.currentUser.friends)
    
    return (
        <div className="messages">
            {props.currentUser.friends.map((friend, i)=>(
                friend.messages ? 
                    <div key={i} className="message">
                        <div className="message__image">
                            <UserIcon imageUri={`data:image/png;base64,${friend.userInfo.userImage}`}/>
                        </div>
                        <div className="message__content">
                            <h2 className="secondary-header">{friend.userInfo.username}</h2>
                            <p className="paragraph">{friend.messages[friend.messages.length-1].text}</p>
                        </div>
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
