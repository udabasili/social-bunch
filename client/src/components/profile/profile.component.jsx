import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVideo,  faBan } from '@fortawesome/free-solid-svg-icons';
import {Link} from "react-router-dom";
import ModalWindow from "../modal-window/modal-window.component";
import VideoComponent from "../video-calling/video-component"


export default class Profile extends Component {
    
    state = {
        showModal: false,
        room:Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
    }
    toggleModal = (showModal) =>{
        this.setState({showModal: showModal})
    }   

    render() {        
        return (
            <div className="profile">
                { this.props.userData ? 
                    <div>
                        <div className="profile__image">
                            <img 
                                src={ this.props.userData.friend.image ? 
                                    `data:image/png;base64,${this.props.userData.friend.image }` :
                                    this.props.userData.friend.userImage}
                                className="profile__image-user"/>
                        </div>
                        <h2 className="profile__username">{this.props.userData.friend.username}</h2>   
                        <div className="communication">
                            <FontAwesomeIcon className="icon-custom"  onClick={()=> this.toggleModal(true)} icon={faVideo}/>
                            <FontAwesomeIcon className="icon-custom" icon={faBan}/>
                        </div>  
                        <Link 
                            className="btn btn-white" 
                            to={{
                                pathname: `/user/${this.props.userData.friend._id}/profile`,
                                state: { userData: this.props.userData.friend}
                            }}
                        >
                        Profile
                        </Link> 
                    </div> :
                    <div>
                    </div>}
                    {this.state.showModal && 
                        <ModalWindow closeHandler={this.toggleModal}  >
                            <VideoComponent 
                            closeHandler={this.toggleModal} 
                            calling={this.props.userData.friend.username}
                            caller={this.props.currentUser.username}
                            currentUser={this.props.currentUser.username}
                            room={this.state.room}
                            />
                        </ModalWindow>
                    }
                         
            </div>
        )
    }
}
