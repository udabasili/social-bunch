import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faMailBulk, faUserFriends, faObjectGroup } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';

const LeftNav = ({navLinkChangeHandler}) => {

//    const onClickHandle = (value) =>{
//         let divArray = Array.from(document.querySelectorAll('.side-nav__item'))
//         navLinkChangeHandler(value)
//         divArray.map(element=> (
//             (element.name === value) ? 
//             element.classList.add('active') :
//             element.classList.remove('active')
//             )
//         )
//     }
    
    return (
        <div className='side-nav'>
            <nav className='side-nav__list'>
                <NavLink exact to='/' className='side-nav__item' title='Mail' >
                    <FontAwesomeIcon className='side-nav__icon' icon={faMailBulk} ></FontAwesomeIcon>
                </NavLink>
                <NavLink to='/events' className=' side-nav__item' title='Events' >
                    <FontAwesomeIcon className='side-nav__icon' icon={faCalendar} ></FontAwesomeIcon>
                </NavLink>
                <NavLink to='/groups' className='side-nav__item' title='Groups'>
                    <FontAwesomeIcon  className='side-nav__icon' icon={faObjectGroup}></FontAwesomeIcon>
                </NavLink>
                <NavLink to='/users' className='side-nav__item' title='Users' >
                    <FontAwesomeIcon  className='side-nav__icon' icon={faUserFriends}></FontAwesomeIcon>
                </NavLink>
            </nav>        
        </div>
    )
}

export default LeftNav;