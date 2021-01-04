import React from 'react';
import {connect} from "react-redux";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { toggleDropdown } from '../redux/action/notification.action';


/**
  * @desc show past messages between a user and his friend
  * friends list to User Icon as props
  * @param props for the toggle button of showing and hiding profile window and current user from redux

*/



function UserMessageHistory(props) {

  function onClickHandler(friend){
    props.toggleDropdown(false);
    props.showMessages({
      image: friend.userImage,
      ...friend,
    })
  }
    return (
      <div className="messages">
        {props.currentUser.friends.map((friend, i) =>
          (
            <div
              key={i}
              onClick={() => onClickHandler(friend)}
              className="message"
            >
              <div className="message__image">
                <LazyLoadImage
                alt={friend.userImage}
                  src={friend.userImage}
                  className="user__photo"
                />
              </div>
              <div className="message__text">
                <h2 className="username">{friend.username}</h2>
                <p className="label">Open Messenger</p>
              </div>
              <hr />
            </div>
          ) 
        )}
      </div>
    );
}
const mapStateToProps = (state) =>({
    currentUser:state.user.currentUser,
    
 })
 
  const mapDispatchToProps = dispatch =>({
    toggleDropdown : (showNotif) => dispatch(toggleDropdown(showNotif)),

 })

 export default connect(mapStateToProps, mapDispatchToProps)(UserMessageHistory)
