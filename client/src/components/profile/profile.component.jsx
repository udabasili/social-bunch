import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVideo, faPhone, faBan } from '@fortawesome/free-solid-svg-icons';

export default class Profile extends Component {
    
    render() {
        console.log(this.props)

        let userData = this.props.userData.friend;
        return (
            <div className="profile">
                <div className="profile__image">
                    <img 
                        src={userData.image}
                        alt="your profile"
                        className="profile__image-user"
                        />
                </div>
                <h2 className="primary__header">{userData.username}</h2>   
                <div className="communication">
                    <FontAwesomeIcon className="icon-custom" icon={faVideo}/>
                    <FontAwesomeIcon className="icon-custom" icon={faPhone}/>
                    <FontAwesomeIcon className="icon-custom" icon={faBan}/>
                </div>  
                <a className="btn btn-white">Profile</a>               
            </div>
        )
    }
}
