import  React from 'react';
import  UserIcon from './user-icon-status';
import {connect} from 'react-redux';
import { toggleDropdown } from '../redux/action/notification.action';


/**
  * @desc handles showing the user's friends and checking if they are online or not sending the online
  * friends list to User Icon as props
  * @param props for the toggle button of showing and hiding profile window and current user from redux

*/

function Contacts({currentUser, allUsers, showMessages, toggleDropdown, hideUsersforMobileHandler}) {  
  return (
      <div className='contacts'>
          {currentUser.friends ?
            <div className='contact'>
              {currentUser.friends.map((friend, i)=>(
                  <div 
                    key={i} 
                      onClick={() =>{
                        toggleDropdown(false);
                        hideUsersforMobileHandler(true)
                        showMessages({
                          image: friend.userImage,
                          ...friend,
                          })
                        }
                      }
                    className='contact__item'>
                      <UserIcon 
                        imageUri={friend.userImage}
                        username = {friend.username} 
                      />
                      <div className='contact__username'>{friend.username}</div>
                  </div>
              ))}
            </div>:
            <div className='contact'> 
              NO FRIENDS YET     
            </div>
            }
      </div>
    
  )
}


const mapStateToProps = (state) =>({
  currentUser:state.user.currentUser,
  allUsers: state.user.users,

})

const mapDispatchToProps = dispatch =>({
    toggleDropdown : (showNotif) => dispatch(toggleDropdown(showNotif)),

 })
export default connect(mapStateToProps, mapDispatchToProps)(Contacts)