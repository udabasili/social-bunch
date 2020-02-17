import React from 'react'
import {Link} from "react-router-dom";
import { faUserPlus, faEye, faHourglass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {connect} from "react-redux";

function UserListItem({sendFriendRequest = f => f, user, currentUser}) {     

    const {_id, userImage, username, friendsRequests} = user;
    //change the icon shown depending on if the user has been added as a friend, friend request or null
    function checkCondition(){
      if ( friendsRequests ){
        
        if(friendsRequests.some(request => request.username === username)){          
          return <FontAwesomeIcon  icon={faHourglass}/>
          }
        } else if ( currentUser.requestsSent.some(request => request.sentTo === username)
        ){
          return <FontAwesomeIcon  icon={faHourglass}/>
        }
        else if (currentUser.friends.some(friend => friend.userInfo.username === username)||
        currentUser.username === username
        ){
          return <div></div>
        }
  
      else{
        return <FontAwesomeIcon className="friend-request" onClick={()=>sendFriendRequest(_id)} icon={faUserPlus}/>

      }
        {

          }
    }
  return (
    <div class="user-card">
          <img src={userImage}  className="user-card__image" />
            <div 
              className={`user-card__info`}>
                <div className="user-card__username">{username}</div>
                <div class="user-card__buttons"> 
                  {checkCondition()}
                  <Link 
                    to={{
                        pathname: `/user/${_id}/profile`,
                        state: { userData: user}
                        }}
                        >
                      <FontAwesomeIcon  icon={faEye}/>
                </Link> 
            </div>
        </div>
    </div>
    
  );
}
  const mapStateToProps = (state) =>({
      currentUser:state.user.currentUser,

  })
  
 export default connect(mapStateToProps, null)(UserListItem);
