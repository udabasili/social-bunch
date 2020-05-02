import React from 'react';
import {connect} from "react-redux";


/**
  * @desc show past messages between a user and his friend
  * friends list to User Icon as props
  * @param props for the toggle button of showing and hiding profile window and current user from redux

*/

function UserMessageHistory(props) {

    return (
        <div className="messages">
            {props.currentUser.friends.map((friend, i) => (
                friend.messages  ? 
                    <div key={i} onClick={()=>props.showMessages({
                        image: friend.userInfo.userImage,
                        messages: friend.messages,
                        ...friend.userInfo}
                        )} 
                        className="message">
                        <div className="message__image">
                            <img 
                                src={friend.userInfo.userImage}
                                alt="your profile" 
                                className="user__photo"/>
                        </div>
                        <div className="message__content">
                            <h2 className="secondary-header">{friend.userInfo.username}</h2>
                            <p className="message__content__count">Show Messages</p>
                        </div>
                        <hr/>
                    </div>:
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
