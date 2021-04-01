import React, {useEffect} from 'react';
import {
    TiMessages
} from "react-icons/ti";
import {
    FcLike
} from "react-icons/fc";
import { connect } from 'react-redux'
import { markMessageRead } from '../redux/notification/notification.actions';
import { NavLink } from 'react-router-dom';

function NotificationDropdown({
    title,
    items,
    markMessageRead,
    currentUser,
    footer,
    }) {

    function readNotification(notificationId) {
        markMessageRead(notificationId)
    }

    const prefix = (value) => {
        if(value > 1){
            return ' s ago'
        } else{
            return ' ago'
        }
    }

    const timeAgo = (time) => {

        const seconds = (new Date() - new Date(time)) / 1000;
        let interval = Math.floor(seconds / 31536000)
        if (interval >= 1){
            return interval + ' year' +  prefix(interval);
        }
        interval = Math.floor(seconds / 2628000)
        if (interval >= 1) {
            return interval + ' month' + prefix(interval);
        }

        interval = Math.floor(seconds / 604800)
        if (interval >= 1) {
            return interval + ' week' + prefix(interval);
        }

        interval = Math.floor(seconds / 86400)
        if (interval >= 1) {
            return interval + ' day' + prefix(interval);
        }

        interval = Math.floor(seconds / 3600)
        if (interval >= 1) {
            return interval + ' hour' + prefix(interval);
        }

        interval = Math.floor(seconds / 60)
        if (interval >= 1) {
            return interval + ' minute' + prefix(interval);
        }

        return Math.floor(seconds) + ' second' + prefix(seconds);
    }

    return (
        <div className="notification-dropdown dropdown">
            <div className="notification-dropdown__header">
                {title}
            </div>
            <ul className="notification-dropdown__list">
                {
                    items
                        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                        .map((item, index) => (
                    <NavLink
                        className={`
                            notification-dropdown__item
                            ${!item.textRead ? 'unread': ''}
                        `}
                        onClick={() => readNotification(item._id) }
                        key={item._id} 
                         to={{
                            pathname: `/posts/${item.postId}`,
                        }}
                    >
                        <div className="avatar">
                            <img src={item.notificationAbout.userImage} alt={item.notificationAbout.username} />
                        </div>
                        <div className="information">
                            <span className="username">
                                {item.notificationAbout.username}
                            </span>
                            <span className="description">
                                {
                                    item.type === 'liked' && 'liked your post'
                                }
                                {
                                    item.type === 'commented' &&  'commented on your post'

                                }
                            </span>
                            <span className="time">
                                {timeAgo(item.createdAt)}
                            </span>
                        </div>
                        {
                            item.type === 'liked' && <FcLike/>
                        }
                        {
                            item.type === 'commented' &&  <TiMessages/>

                        }
                    </NavLink>
                ))}
            </ul>
            <div className="notification-dropdown__footer">
                {footer}
            </div>
        </div>
    )
}

const mapStateToProps = (state) => ({
    currentUser: state.user.currentUser

})

const mapDispatchToProps = {
    markMessageRead
}

export default connect(mapStateToProps, mapDispatchToProps)(NotificationDropdown)

