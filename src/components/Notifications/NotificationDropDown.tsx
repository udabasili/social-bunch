import React from 'react';
import {
    TiMessages
} from "react-icons/ti";
import {
    FcLike
} from "react-icons/fc";
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom';
import { NotificationProps } from '@/features/notification/types';
import { clearAllNotifications } from '@/features/notification/api/clearAllNotifications';
import { markMessageRead } from '@/features/notification/api/updateNotification';
import { timeAgo } from '@/utils/time';

type NotificationDropdownProps = {
    title: string;
    notifications: Array<NotificationProps>
    footer: string
    
}
function NotificationDropdown({
        title,
        notifications,
        footer,
    }: NotificationDropdownProps) {

    function readNotification(notificationId: string) {
        markMessageRead(notificationId)
    }


    return (
        <div className="notification-dropdown dropdown">
            <div className="notification-dropdown__header">
                {title}
            </div>
            <ul className="notification-dropdown__list">
                {
                    notifications
                        .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                        .map((notification, index) => (
                    <NavLink
                        className={`
                            notification-dropdown__notification
                            ${!notification.textRead ? 'unread': ''}
                        `}
                        onClick={() => readNotification(notification._id) }
                        key={notification._id} 
                         to={{
                            pathname: `/posts/${notification.postId}`,
                        }}
                    >
                        <div className="avatar">
                            <img src={notification.notificationAbout.image} alt={notification.notificationAbout.username} />
                        </div>
                        <div className="information">
                            <span className="username">
                                {notification.notificationAbout.username}
                            </span>
                            <span className="description">
                                {
                                    notification.type === 'liked' && 'liked your post'
                                }
                                {
                                    notification.type === 'commented' &&  'commented on your post'

                                }
                            </span>
                            <span className="time">
                                {timeAgo(notification.createdAt)}
                            </span>
                        </div>
                        {
                            notification.type === 'liked' && <FcLike/>
                        }
                        {
                            notification.type === 'commented' &&  <TiMessages/>

                        }
                    </NavLink>
                ))}
            </ul>
            <div className="notification-dropdown__footer" onClick={clearAllNotifications}>
                {footer}
            </div>
        </div>
    )
}


export default NotificationDropdown

