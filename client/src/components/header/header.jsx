import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faSignOutAlt, faBell } from '@fortawesome/free-solid-svg-icons';
import {connect} from "react-redux"
import {withRouter} from "react-router-dom";

function Header (props) {
    const {currentUser} = props
    const signOut = () =>{
        sessionStorage.removeItem("validator")
        props.history.push("/auth")
    }    
    return (
        <div className="header">
            <div className="user">
                <FontAwesomeIcon 
                    icon={faBell}
                    className="icon-custom"
                    />
                <img 
                src={currentUser.userImage}
                alt="your profile" 
                className="user__photo"/>
                <span className="secondary-header">{currentUser.username}</span>
                <div className="sign-out">
                    <FontAwesomeIcon 
                        onClick={signOut} 
                        icon={faSignOutAlt}
                        className="icon-custom"
                    />
                </div>
            </div>
        </div>
    )   
}

const mapStateToProps = (state) =>({
    currentUser:state.user.currentUser
 })
 
 export default withRouter(connect(mapStateToProps, null)(Header));