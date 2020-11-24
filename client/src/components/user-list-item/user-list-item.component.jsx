import React from 'react'
import {Link} from "react-router-dom";
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import {connect} from "react-redux";

/**
 * 
 * @param {function} addFriend  
 * @param {Object} user 
 * @param {Object} currentUser 
 */
function UserListItem({addFriend = f => f, user, currentUser}) {     
  const {_id, userImage, username, friendsRequests} = user;
  /**
   * change the icon based on whether the users has sent friend request or not
   */
  function checkUserStatus(){
     if (currentUser.friends.some(friend => friend.userInfo.username === username)||
      currentUser.username === username
      ){
        return (
			<div className='user__buttons'>
				<Link
					className='user__button prof'
					to={{
						pathname: `/user/${_id}/profile`,
						state: { userData: user }
					}}
				>
					Profile
				</Link>
			</div>
		)
      }

    else{
      return  (
		  <div className='user__buttons'>
			  <p className='user__button add' onClick={() => addFriend(_id)} >Add Friend</p>
			  <Link
				  className='user__button prof'
				  to={{
					  pathname: `/user/${_id}/profile`,
					  state: { userData: user }
				  }}
			  >
				  Profile
				</Link>
		  </div>
          )
    }
  }
  
  
  return (
    <div className='user__item'>
		<div className='user__image'>
			<img src={userImage} className="image" />
		</div>
		<div className='user__details'>
			<p class="user__name">{username}</p>
			{checkUserStatus()}
		</div>
    </div>
    // <tr>
		// <td>
    //     <img src={userImage}  className="user__image" />
    //     <p  class="user__name">{username}</p>
		// 	</td>
		// 	<td style={{width:"20%"}}>
    //     <a href="#" class="table-link">
    //       <Link 
    //           to={{
    //               pathname: `/user/${_id}/profile`,
    //               state: { userData: user}
    //               }}
    //               >
    //           <span class="fa-stack">
    //             <i class="fa fa-square fa-stack-2x"></i>
    //             <i class="fa fa-eye fa-stack-1x fa-inverse"></i>
    //           </span>
    //         </Link> 
            
    //     </a>
		// 		{checkUserStatus()}
		// 		</td>
		// 	</tr>
    

  );
}

const mapStateToProps = (state) =>({
  currentUser:state.user.currentUser,
})
  
 export default connect(mapStateToProps, null)(UserListItem);
