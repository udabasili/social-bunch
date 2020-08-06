import React from 'react'
import {Link} from "react-router-dom";
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import {connect} from "react-redux";

/**
 * 
 * @param {function} sendFriendRequest  
 * @param {Object} user 
 * @param {Object} currentUser 
 */
function UserListItem({sendFriendRequest = f => f, user, currentUser}) {     
  const {_id, userImage, username, friendsRequests} = user;
  console.log(friendsRequests)

  /**
   * change the icon based on whether the users has sent friend request or not
   */
  function checkUserStatus(){
    if ( friendsRequests.length > 0 ){
      if(friendsRequests.some(request => request.username === username)){          
        return (
          <a href="#" class="table-link">
            <span class="fa-stack">
              <i class="fa fa-square fa-stack-2x"></i>
              <i class="fa fa-hourglass fa-stack-1x fa-inverse"></i>
            </span>
          </a>
          )
        }
      } else if ( currentUser.requestsSent.some(request => request.sentTo === username)
      ){
        return (
          <a href="#" class="table-link">
            <span class="fa-stack">
              <i class="fa fa-square fa-stack-2x"></i>
              <i class="fa fa-hourglass fa-stack-1x fa-inverse"></i>
            </span>
          </a>
          )
      }
      else if (currentUser.friends.some(friend => friend.userInfo.username === username)||
      currentUser.username === username
      ){
        return <div></div>
      }

    else{
      return  (
          <a href="#" class="table-link" onClick={()=>sendFriendRequest(_id)} icon={faUserPlus}>
            <span class="fa-stack">
              <i class="fa fa-square fa-stack-2x"></i>
              <i class="fa fa-user-plus fa-stack-1x fa-inverse"></i>
            </span>
          </a>
          )
    }
  }
  
  return (
    <tr>
		<td>
        <img src={userImage}  className="user__image" />
        <p  class="user__name">{username}</p>
			</td>
			<td style={{width:"20%"}}>
        <a href="#" class="table-link">
          <Link 
              to={{
                  pathname: `/user/${_id}/profile`,
                  state: { userData: user}
                  }}
                  >
              <span class="fa-stack">
                <i class="fa fa-square fa-stack-2x"></i>
                <i class="fa fa-eye fa-stack-1x fa-inverse"></i>
              </span>
            </Link> 
            
        </a>
				{checkUserStatus()}
				</td>
			</tr>
    

  );
}

const mapStateToProps = (state) =>({
  currentUser:state.user.currentUser,
})
  
 export default connect(mapStateToProps, null)(UserListItem);
