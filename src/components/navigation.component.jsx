import React,{ useEffect } from 'react'
import { ReactComponent as AppIcon } from '../assets/icons/instagram.svg';
import { BiHomeAlt } from "react-icons/bi";
import { BsBell } from "react-icons/bs";
import { TiMessages } from "react-icons/ti";
import { NavLink } from 'react-router-dom';
import NotificationDropdown from './notification-dropdown.component';
import UserNotification from './user-notification.component';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { firebaseConnect } from 'react-redux-firebase'
import { compose } from 'redux';

function Navigation({
    currentUser,
    unReadCount,
    notifications,
    unReadMessagesLength
    }) {

        return (
            <div className="navigation">
                <nav className="navigation--left">
                    <div className="app">
                        <AppIcon/>
                        <span>SB</span>
                    </div>
                    <ul className="nav__list">
                        <li className="nav__item ">
                            <NavLink exact className="nav__link" activeClassName="nav-active" to="/">
                                <BiHomeAlt className="navigation__icon"/>
                            </NavLink>
                        </li>
                        <li className="nav__item nav__item--1">
                            <NavLink 
                                title="messages" 
                                className="nav__link" 
                                activeClassName="nav-active" 
                                to="/messages"
                            >
                                <TiMessages className="navigation__icon"/>
                            </NavLink>
                             {
                                unReadMessagesLength > 0 && (
                                    <span className='notification-count'>{unReadMessagesLength}</span>
                                )
                            }
                            
                        </li>
                        <li className="nav__item nav__item--1">
                            <BsBell className="navigation__icon"/>
                            {
                                unReadCount > 0 && (
                                    <span className='notification-count'>{unReadCount}</span>
                                )
                            }
                            <NotificationDropdown
                                title="Notification"
                                items={notifications}
                                footer="Clear All"
                                />
                        </li>
                    </ul>
                </nav>
                <input className="navigation__input" id="nav-toggle" type="checkbox"/>
                <label className="navigation__button" htmlFor="nav-toggle">
                    <span  className="navigation__button-icon">&nbsp;</span>
                </label>
                <div className="navigation--right">
                    <div className="user">
                        <div className="user-icon">
                            <img alt={currentUser.username} src={currentUser.image}/>
                        </div>
                        <p className="user-name">{currentUser.username}</p>
                        <UserNotification currentUser={currentUser}/>
                    </div>
                </div>
            </div>
        )
}


Navigation.propTypes = {
    currentUser: PropTypes.object,
    unReadCount: PropTypes.number,
    unReadMessagesLength: PropTypes.number,
    notifications: PropTypes.array,
}


const mapStateToProps = (state, props) => {
    let data = state.firebase.data.notifications
    const currentUserId = props.currentUser._id;
    let unReadCount = 0;
    const messages = state.firebase.data.messages;
    let unReadMessagesLength = 0;
    let currentUserMessageIds = '';
    if (messages) {
        const objKeys = Object.keys(messages)
        currentUserMessageIds = objKeys.filter(item => item.includes(currentUserId))
        currentUserMessageIds.forEach((id) => {
            let message = messages[id]
            for (let key in message) {
                if (!message[key].read && message[key].createdBy !== currentUserId) {
                    unReadMessagesLength++
                    console.log(unReadMessagesLength)
                }
            }
        })
    }
   
    let notifications = [];
    if (data && currentUserId) {
        data = data[currentUserId];
        for (let key in data) {
            let object = data[key];
            notifications.push({
                _id:key,
                ...object
            })
            
        }
        unReadCount = notifications.filter((data) => (
             !data.textRead
         )).length
    } 
    return {
        unReadCount,
        notifications,
        unReadMessagesLength
    }
}


export default compose(
    firebaseConnect((props) => [
        {
            path: `notifications/${props.currentUser._id}`        
        },
        {
            path: `messages`
        }
    ]),
    connect(mapStateToProps, null)
)(Navigation);