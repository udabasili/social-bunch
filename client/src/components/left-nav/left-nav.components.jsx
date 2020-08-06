import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faMailBulk, faUserFriends, faObjectGroup } from '@fortawesome/free-solid-svg-icons';

const LeftNav = ({navLinkChangeHandler}) => {

   const onClickHandle = (value) =>{
        let divArray = Array.from(document.querySelectorAll('.nav-icon__item'))
        navLinkChangeHandler(value)
        divArray.map(element=> (
            (element.name === value) ? 
            element.classList.add('active') :
            element.classList.remove('active')
            )
        )
    }
    
    return (
        <div className='nav-container'>
            <nav className='nav-icon__list'>
                <a href='#0' className='nav-icon__item active' name='messages' onClick={()=>onClickHandle('messages')}>
                    <FontAwesomeIcon className='nav-icon__icon' icon={faMailBulk} ></FontAwesomeIcon>
                </a>
                <a href='#0' className=' nav-icon__item' name='events' onClick={()=>onClickHandle('events')}  >
                    <FontAwesomeIcon className='nav-icon__icon' icon={faCalendar} ></FontAwesomeIcon>
                </a>
                <a href='#0' className='nav-icon__item' name='groups' onClick={()=>onClickHandle('groups')}>
                    <FontAwesomeIcon  className='nav-icon__icon' icon={faObjectGroup}></FontAwesomeIcon>
                </a>
                <a href='#0' className='nav-icon__item' name='users' onClick={()=>onClickHandle('users')}>
                    <FontAwesomeIcon  className='nav-icon__icon' icon={faUserFriends}></FontAwesomeIcon>
                </a>
            </nav>        
        </div>
    )
}

export default LeftNav;