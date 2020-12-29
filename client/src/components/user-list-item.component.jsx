import React from 'react'
import {Link} from "react-router-dom";
import {connect} from "react-redux";

/**
 * 
 * @param {function} addFriend  
 * @param {Object} user 
 * @param {Object} currentUser 
 */
function UserListItem({ addFriend = f => f, removeFriend = f => f, user, currentUser}) {     
  const {_id, userImage, username} = user;
  /**
   * change the icon based on whether the users has sent friend request or not
   */
  function checkUserStatus(){
     if (currentUser.friends.some(friend => friend.username === username)){
        return (
			<div className='user__buttons'>
				<p className='user__button remove' onClick={() => removeFriend(_id)} >Remove</p>
				<Link
					className='user__button profile-button'
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
	 else if (currentUser.username === username){
		 return (
			 <div className='user__buttons'>
				 <p className='user__button null' >Me</p>
				 <Link
					 className='user__button profile-button'
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
				  className='user__button profile-button'
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
			<img src={userImage} className="image" alt={username} />
		</div>
		<div className='user__details'>
			<p class="user__name">{username}</p>
			{checkUserStatus()}
		</div>
    </div>

  );
}

const mapStateToProps = (state) =>({
  currentUser:state.user.currentUser,
})
  
 export default connect(mapStateToProps, null)(UserListItem);
