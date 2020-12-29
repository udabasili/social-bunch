import React from 'react';
import {connect} from "react-redux";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

/**
  * @desc show past messages between a user and his friend
  * friends list to User Icon as props
  * @param props for the toggle button of showing and hiding profile window and current user from redux

*/

function UserMessageHistory(props) {
    return (
      <div className="messages">
        {props.currentUser.friends.map((friend, i) =>
          (
            <div
              key={i}
              onClick={() =>
                props.showMessages({
                  image: friend.userImage,
                  ...friend,
                })
              }
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
    currentUser:state.user.currentUser
 })
 
 export default connect(mapStateToProps, null)(UserMessageHistory)
