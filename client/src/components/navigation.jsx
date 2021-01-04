import React,{useState} from "react";
import {connect} from "react-redux";
import {setCurrentUser, logOut,  addFriend } from "../redux/action/user.action";
import {withRouter, Link} from "react-router-dom";
import {ReactComponent as Logo} from '../assets/images/comment.svg'
import {
    TiBell
} from "react-icons/ti";
import Dropdown from "./dropdown.component";
import { toggleDropdown } from "../redux/action/notification.action";
/**
  * @desc header handling notifications and log out actions
  * friends list to User Icon as props
  * 
  * @param props for the toggle button of showing and hiding profile window and current user from redux
  * @author Udendu Abasili

*/
function Navigation ({currentUser, logOut, showNotifications, toggleDropdown, notifications}) {
    
    const clickHandler = () => {
        document.querySelector('.navigation__checkbox').checked = false
    }

    const logOutHandler = () =>{
        logOut()
        clickHandler()
    }

    return (
        <React.Fragment>
            <nav className="navigation">
                <div className="logo-box">
                    <Logo className='logo'/>
                    <Link to="/" className='app-name'>
                        Simply Chat
                    </Link>
                </div>
                <div className='notification'>
                    <TiBell className="notification__icon" onClick={()=> toggleDropdown()} />
                    <p className='notification__count'>
                        {notifications.length}
                    </p>
                </div>
                {showNotifications && <Dropdown notifications={notifications}/>}
                
                <input type='checkbox' className='navigation__checkbox' id='toggle' />
                <label className='navigation__button' htmlFor='toggle'>
                    <span className='navigation__icon'>&nbsp;</span>
                </label>
                <ul className="navigation__list">
                    <li className="navigation__item" onClick={() => clickHandler()}>
                        <Link to="/" className="navigation__link">
                            Home
                        </Link>
                    </li>
                    <li className="navigation__item" onClick={() => clickHandler()}>
                        <Link to={{
                            pathname: `/user/${currentUser._id}/profile`,
                            state: { userData: currentUser}
                        }} className="navigation__link">
                            My Profile
                        </Link>
                    </li>
                    
                        <li className="navigation__item">
                            <Link to="/" onClick={logOutHandler} className="navigation__link">
                                Log Out
                            </Link>
                        </li>
                </ul>
            </nav>
        </React.Fragment>
    )   
}

const mapStateToProps = (state) =>({
    currentUser:state.user.currentUser,
    isAuthenticated:state.user.isAuthenticated,
    notifications: state.notification.notifications,
    showNotifications: state.notification.showNotifications,


 })

 const mapDispatchToProps = dispatch =>({
    addFriend: (addedUserId) => dispatch(addFriend(addedUserId)),
    setCurrentUser: user => dispatch(setCurrentUser(user)),
    logOut : () => dispatch(logOut()),
    toggleDropdown : () => dispatch(toggleDropdown()),

 })
 
 export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Navigation));