import React from 'react';
import UserIcon from "../user-icon-status/user-icon-status";
import {connect} from "react-redux";


function Messages(props) {
    return (
        <div className="messages">
            {props.currentUser.friends.map((friend, i)=>(
                friend.message ? 
                    <div key={i} className="message">
                        <div className="message__image">
                            <UserIcon imageUri={props.currentUser.userImage}/>
                        </div>
                        <div className="message__content">
                            <h2 className="secondary-header">{friend.userInfo.username}</h2>
                            <p className="paragraph">{friend.message.text}</p>
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
