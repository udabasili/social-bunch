import React from 'react'
import { NavLink } from "react-router-dom";
import { HiOutlineUserGroup } from 'react-icons/hi';
import { BiCalendarEvent } from 'react-icons/bi';
import { FaUserFriends } from 'react-icons/fa';

export function LeftNavigation() {
    return (
        <div className="left-nav">
            <ul className="left-nav__list">
                <li className="left-nav__item">
                    <NavLink 
                        to='/groups' 
                        className={({ isActive }) => isActive ? "left-nav__link left-nav__active" : "left-nav__link  "}
                    >
                        <HiOutlineUserGroup className="left-nav__icon" />
                        <span className="left-nav__text" >
                            Groups
                        </span>
                    </NavLink>
                </li>
                <li className="left-nav__item">
                    <NavLink 
                        to='/events' 
                        className={({ isActive }) => isActive ? "left-nav__link left-nav__active" : "left-nav__link"}

                    >
                        <BiCalendarEvent className="left-nav__icon" />
                        <span className="left-nav__text" >
                            Events
                        </span>
                    </NavLink>
                </li>
                <li className="left-nav__item">
                    <NavLink 
                        to='/users' 
                        className={({ isActive }) => isActive ? "left-nav__link left-nav__active" : "left-nav__link"}
                        >
                        <FaUserFriends className="left-nav__icon" />
                        <span className="left-nav__text" >
                            Users
                        </span>
                    </NavLink>
                </li>
            </ul>
        </div>
    )
}
