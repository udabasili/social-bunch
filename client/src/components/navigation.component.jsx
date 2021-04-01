import React,{ useEffect } from 'react'
import { ReactComponent as AppIcon } from '../assets/icons/instagram.svg';
import { BiHomeAlt } from "react-icons/bi";
import { BsBell } from "react-icons/bs";
import { BiMessage } from "react-icons/bi";
import { TiMessages } from "react-icons/ti";
import { NavLink } from 'react-router-dom';
import NotificationDropdown from './notification-dropdown.component';
import UserNotification from './user-notification.component';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loadNotifications } from '../redux/notification/notification.actions';
import Socket from '../services/chat-client';
import { getCurrentUserMessages } from '../redux/message/message.action';


function Navigation({
    currentUser,
    unReadCount,
    loadNotifications,
    notifications,
    getCurrentUserMessages,
    unReadMessagesLength
    }) {

        const socket = new Socket()
        function updateNotifications(notificationFunction) {
            let updated = notificationFunction.updateNotification.filter((notification) => (
                notification.owner === currentUser._id
            ))
            loadNotifications(updated)
        }

        useEffect(() => {
            socket.notificationsListener(updateNotifications)
            getCurrentUserMessages()
            return () => {
                socket.UnregisternotificationsListener(updateNotifications)
            }

        }, [])

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
                            <img alt={currentUser.username} src={currentUser.userImage}/>
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
    loadNotifications: PropTypes.func,
    getCurrentUserMessages: PropTypes.func
}


const mapStateToProps = (state) => ({
    unReadCount: state.notifications.unReadCount,
    currentUser: state.user.currentUser,
    notifications: state.notifications.notifications,
    users: state.users.allUsers,
    unReadMessagesLength: state.messages.unReadMessagesLength
})

const mapDispatchToProps = {
    loadNotifications,
    getCurrentUserMessages
}

export default connect(mapStateToProps, mapDispatchToProps)(Navigation)
