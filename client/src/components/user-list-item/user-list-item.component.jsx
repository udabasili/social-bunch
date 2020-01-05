import React from 'react'
import UserIcon from "../user-icon-status/user-icon-status";
import { faUserPlus, faEye } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {connect} from "react-redux";

function UserListItem({addFriend = f => f, userData, currentUser}) {   
    const {_id, userImage, username} = userData;
    console.log(userData);
    
  return (
    <div class="user-card">
    <UserIcon imageUri={userImage}/>
    <div className="user-card__content">
        <div class="user-card__text">
            <h2 className="secondary-header">{username}</h2>
        </div>
        { currentUser.username !== username &&
        <div class="user-card__buttons"> 
          
            <FontAwesomeIcon  className="icon-custom" onClick={()=>addFriend(username,true)} icon={faUserPlus}/>
            <FontAwesomeIcon className="icon-custom" icon={faEye}/>
        </div>
        }
    </div>
    </div>
  );
}
const mapStateToProps = (state) =>({
    currentUser:state.user.currentUser,

  })
  
  export default connect(mapStateToProps, null)(UserListItem);
