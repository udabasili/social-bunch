import React from 'react';

const Dropdown = ({notifications=[]}) => {
    return (
        <div className='dropdown'>
            <div className='dropdown__header'>
                Notification
            </div>
            {
                notifications ?
                <ul className='dropdown__list'>
                    {notifications.map(notification =>(
                        <li className={`dropdown__item ${notification.textRead ? "read" : "unread"}` } key={notification._id}>
                            {notification.text}
                        </li>
                    ))}
                </ul> :
                <p>NO Notification</p>
                
            }
            
        </div>
    );
}

export default Dropdown;
