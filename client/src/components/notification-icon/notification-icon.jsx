import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';

function NotificationIcon({toggleDropDown, showDropDown, friendsRequestCount}) {
  return (
    <div className='notification__dialog'>
        <div className='notification__dialog__counter'>{friendsRequestCount}</div>
        <FontAwesomeIcon 
            icon={faBell}
            onClick={()=>toggleDropDown(!showDropDown)}
            className='notification__dialog__icon'
            />
    </div>
  );
}


export default NotificationIcon