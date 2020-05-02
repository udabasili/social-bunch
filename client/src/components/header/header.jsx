import React,{useState} from "react";
import {connect} from "react-redux";
import {setCurrentUser, logOut, rejectFriendRequest, acceptFriendRequest } from "../../redux/action/user.action";
import {withRouter, Link} from "react-router-dom";
import NotificationIcon from "../../components/notification-icon/notification-icon";

/**
  * @desc header handling notifications and log out actions
  * friends list to User Icon as props
  * 
  * @param props for the toggle button of showing and hiding profile window and current user from redux
  * @author Udendu Abasili

*/
function Header ({currentUser, acceptRequest, rejectRequest,isAuthenticated, logOut}) {
    
    const [showDropDown, toggleDropDown] = useState(false)
    const toggleDropDownHandler = () =>{
        toggleDropDown(!showDropDown)
    }

    return (
        <React.Fragment>
            <nav className="navigation">
                <ul className="navigation__list">
                    <li className="navigation__item">
                        <Link to="/" className="navigation__list">
                            Home
                        </Link>
                    </li>
                    { isAuthenticated ?
                        <React.Fragment>
                            <li className="navigation__item">
                                <Link to={{
                                    pathname: `/user/${currentUser._id}/profile`,
                                    state: { userData: currentUser}
                                    }} className="user__username">
                                    My Profile
                                </Link>
                            </li>
                            <li class="navigation__dropdown">
                                <a href="javascript:void(0)" 
                                    onClick={toggleDropDownHandler}
                                    class="navigation__list-001">
                                    <NotificationIcon 
                                        toggleDropDown={toggleDropDownHandler} 
                                        showDropDown={showDropDown}
                                        friendsRequestCount={currentUser.friendsRequests.length}
                                    />
                                </a>
                                {showDropDown &&
                                    <div className="dropdown">
                                        <div className="dropdown__header">
                                            <p>Friend Requests</p>
                                        </div>
                                        {currentUser.friendsRequests ?
                                            currentUser.friendsRequests.map((friendsRequest) => (
                                            <div className="user-request-list">
                                                <img src={friendsRequest.userInfo.userImage}
                                                    alt="your profile" 
                                                    className="user-request-list__image"/>
                                                <p className="user-request-list__name"><b>{friendsRequest.userInfo.username}</b> <br/></p>
                                                <div className="button-block">
                                                    <div   
                                                        onClick={() =>acceptRequest(friendsRequest.userInfo._id)}  
                                                        className="accept">
                                                        Accept
                                                    </div>
                                                    <div 
                                                        onClick={() =>rejectRequest(friendsRequest.userInfo._id)}
                                                        className="reject">
                                                        Reject
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                        :
                                        <div>No new Requests</div>
                                    }
                                </div>
                            }
                        </li>
                        <li className="navigation__item">
                            <Link to="/" onClick={() =>logOut()} className="navigation__list">
                                Log Out
                            </Link>
                        </li>
                    </React.Fragment>:
                    <React.Fragment>
                        <li className="navigation__item">
                            <Link to={{
                                pathname:"/auth/register",
                                state:{authType:"register"}
                            }} className="navigation__list">
                                Register
                            </Link>
                        </li>
                        <li className="navigation__item">
                            <Link to={{
                                pathname:"/auth/login",
                                state:{authType:"login"}}}  
                                className="navigation__list">
                                Login
                            </Link>
                        </li>
                    </React.Fragment>
                    }
                </ul>
            </nav>
        </React.Fragment>
    )   
}

const mapStateToProps = (state) =>({
    currentUser:state.user.currentUser,
    isAuthenticated:state.user.isAuthenticated,

 })

 const mapDispatchToProps = dispatch =>({
    acceptRequest: (addedUserId) => dispatch(acceptFriendRequest(addedUserId)),
    rejectRequest: (addedUserId) => dispatch(rejectFriendRequest(addedUserId)),
    setCurrentUser: user => dispatch(setCurrentUser(user)),
    logOut : () => dispatch(logOut())
 })
 
 export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));