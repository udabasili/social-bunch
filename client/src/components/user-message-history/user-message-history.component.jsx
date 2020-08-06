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
          friend.messages ? (
            <div
              key={i}
              onClick={() =>
                props.showMessages({
                  image: friend.userInfo.userImage,
                  messages: friend.messages,
                  ...friend.userInfo,
                })
              }
              className="message"
            >
              <div className="message__image">
                <LazyLoadImage
                  src={friend.userInfo.userImage}
                  effect="blur"
                  src={friend.userInfo.userImage}
                  className="user__photo"
                />
              </div>
              <div className="message__content">
                <h2 className="secondary-header">{friend.userInfo.username}</h2>
                <p className="message__content__count">Open Messenger</p>
              </div>
              <hr />
            </div>
          ) : (
            <div></div>
          )
        )}
      </div>
    );
}
const mapStateToProps = (state) =>({
    currentUser:state.user.currentUser
 })
 
 export default connect(mapStateToProps, null)(UserMessageHistory)
