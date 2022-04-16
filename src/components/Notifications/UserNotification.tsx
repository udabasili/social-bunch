import { FaUsers } from "react-icons/fa";
import { toast } from 'react-toastify';
import { NavLink, useNavigate } from "react-router-dom";
import { logout } from '@/features/auth';
import { UserAttributes } from "@/features/user/types";

type UserNotificationProps = {
    currentUser: UserAttributes
}
function UserNotification({currentUser}: UserNotificationProps) {

    const navigate = useNavigate();
    const logOutHandler = () =>{
        logout()
            .then(() =>{
                toast.success('User logged out')
                navigate('/auth')
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


export default UserNotification