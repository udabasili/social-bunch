import React from 'react'
import { FaUsers } from "react-icons/fa";
import PropTypes from 'prop-types';
import { logOut } from '../redux/user/user.action';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import { NavLink, useHistory } from "react-router-dom";

function UserNotification({
    logOut
    }) {

    const history = useHistory();
    const logOutHandler = () =>{
        logOut()
            .then(() =>{
                toast.success('User logged out')
                history.push('/auth')
            })
    }
    
    return (
        <div className="user-dropdown dropdown dropdown--right">
            <ul className="user-dropdown__list">
                <li className="user-dropdown__item">
                    <NavLink to='/profile' className="user-dropdown__link">
                        <FaUsers className="navigation__icon"/>
                        <span>Profile</span>
                    </NavLink>
                </li>
                <li 
                    className="user-dropdown__item non-link" 
                    onClick={logOutHandler}
                >
                    <FaUsers className="navigation__icon"/>
                    <span>Logout</span>
                </li>
            </ul>
        </div>
    )
}

UserNotification.propTypes = {
    logOut: PropTypes.func,
}


const mapDispatchToProps = {
    logOut
}

export default connect(null, mapDispatchToProps)(UserNotification)