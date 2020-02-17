import React,{useState} from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes, faSignOutAlt, faHome } from '@fortawesome/free-solid-svg-icons';
import {connect} from "react-redux";
import {setCurrentUser, logOut, rejectFriendRequest, acceptFriendRequest } from "../../redux/action/user.action";
import {withRouter, Link} from "react-router-dom";
import NotificationIcon from "../../components/notification-icon/notification-icon";



/**
  * @desc header handling notifications and log out actions
  * friends list to User Icon as props
  * @param props for the toggle button of showing and hiding profile window and current user from redux
  * @author Udendu Abasili

*/
function Header ({currentUser, acceptRequest, rejectRequest, logOut}) {
    
    const [showDropDown, toggleDropDown] = useState(false)
    //Logout  user nad clear token, current user in redux and disconnect from server

    const toggleDropDownHandler = (value) =>{
        toggleDropDown(value)
    }

    return (
        <div className="header">
            <Link to="" className="header__home">
                <FontAwesomeIcon icon={faHome}/>
            </Link>
            <div className="user">
                <div className="user__notification">
                    <NotificationIcon 
                        toggleDropDown={toggleDropDownHandler} 
                        showDropDown={showDropDown}
                        friendsRequestCount={currentUser.friendsRequests.length}
                        />
                    {
                    showDropDown &&
                    <ul className="user__notification__list">
                        <h2 className="user__notification__header"
                            >Friend Requests
                        </h2>
                    { currentUser ?
                        currentUser.friendsRequests.map((friendsRequest) => (
                            <li className="user__notification__item">
                                <img 
                                    src={friendsRequest.userInfo.userImage}
                                    alt="your profile" 
                                    className="user__photo"/>
                                <span>{friendsRequest.userInfo.username}</span>
                                <div className="option-button">
                                    <span><FontAwesomeIcon  
                                        onClick={() =>acceptRequest(friendsRequest.userInfo._id)} 
                                        icon={faCheck}/> 
                                    </span>
                                    <span><FontAwesomeIcon 
                                        onClick={() =>rejectRequest(friendsRequest.userInfo._id)} 
                                        icon={faTimes}/> 
                                    </span>
                                </div>
                                
                            </li>
                            )) :
                            <div>
                                No FriendRequest
                            </div>
                        }
                    </ul>
                    }
                </div>
                    <Link to={{
                        pathname: `/user/${currentUser._id}/profile`,
                        state: { userData: currentUser}

                        }} className="user__username">
                        <img 
                        src={currentUser.userImage}
                        alt="your profile" 
                        className="user__photo"/>
                        <span  >{currentUser.username}</span>
                    </Link>
                    <div className="sign-out">
                    <FontAwesomeIcon 
                        onClick={() =>logOut()} 
                        icon={faSignOutAlt}
                        className="icon-custom"
                    />
                </div>
            </div>
        </div>
    )   
}

const mapStateToProps = (state) =>({
    currentUser:state.user.currentUser
 })

 const mapDispatchToProps = dispatch =>({
     acceptRequest: (addedUserId) => dispatch(acceptFriendRequest(addedUserId)),
     rejectRequest: (addedUserId) => dispatch(rejectFriendRequest(addedUserId)),
     setCurrentUser: user => dispatch(setCurrentUser(user)),
     logOut : () => dispatch(logOut())


 })
 
 export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));