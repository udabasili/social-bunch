import React, { Component } from 'react';
import LeftNav from "../../components/left-nav/left-nav.components";
import Contacts from "../../components/contacts/contact.component";
import Messages from "../../components/messages/messages.component";
import Profile from "../../components/profile/profile.component";
import ChatBox from "../../components/chat-box/chat-box.component";
import Events from "../../components/events/events.components";
import Group from "../../components/groups/group.component";
import Users from "../../components/users/users.component";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationArrow, faMusic} from '@fortawesome/free-solid-svg-icons';
import { authEndpoint, clientId, redirectUri, scopes } from "../../components/spotify/config";
import hash from "../../components/spotify/hash";
import {socket} from "../../nodeserver/node.utils";
import ChatArea from '../../components/chat-area/chat-area.component';
import  ChatMessenger  from '../../components/chat-messages/chat-messages.component';
import axios from "axios";

const SpotifyWebApi = require('spotify-web-api-node');
let spotify = new SpotifyWebApi();

class Chatroom extends Component {
  constructor (props) {
    super(props)
    this.state = {
      currentLink:"messages",
      switchButton:{
          location:false,
        },
      token: null,
      messages:[],
      location:null,
      albums:null, 
      friend:null
    };
    this.getCurrentlyPlaying = this.getCurrentlyPlaying.bind(this);
    }
  
    showProfile = (value) =>{
      this.setState({
        friend: value
      })
    }
  switchButton = (type) =>{      
    this.setState((prevState)=>({
        ...prevState,
        switchButton:{
          ...prevState.switchButton,[type]: !prevState.switchButton[type]
        }
    }), ()=> {
      if(this.state.switchButton[type]){
        
        
        this.getUserLocation() 
          
      }
      else{
        this.setState((prevState)=>({
          ...prevState,
            location: null
        }))
      }
    })
  }
  
componentDidMount() {
  let _token = hash.access_token; 
  if (_token && _token !== undefined) {
    localStorage.setItem("token",_token)
    this.setState({
      token: _token
    });
    _token = localStorage.getItem("token")
    this.getCurrentlyPlaying(_token);

    }
    socket.on('privateNewMessage', this.setMessage)

  }


  getUserLocation = () => {
    if (!navigator.geolocation) {
        return alert("Sorry this browser doesn't support geolocation ")
    }    
    navigator.geolocation.getCurrentPosition((position)=>{
        let lat = position.coords.latitude
        let long = position.coords.longitude
        let api = process.env.REACT_APP_GOOGLE_API;
      return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=${api}`)
            .then((response)=> {
                if(response.data.status === "OK"){
                    let location  = response.data.results[8].formatted_address
                    this.setState((prevState)=>({
                      ...prevState,
                        location: location
                    }))
                    
                    }
                }
            )
    })

  }
  
  getCurrentlyPlaying(token) {
    token = localStorage.getItem("token")
    spotify.setAccessToken(token)
    spotify.getNewReleases()
    .then((data)=> {        
        this.setState({albums: data.body.albums.items[0]})
        })
      .catch((error)=>console.log(error)
      )
    }

  navLinkChangeHandler = (value) =>{    
    this.setState({currentLink: value})
  }

  setMessage = (message) =>{
    this.setState(prevState => ({
      ...prevState,
      messages: [...prevState.messages, message]
    })
    )
  }

  navComponents = () =>{
    switch (this.state.currentLink) {
      case "messages":
        return (
          <div>
            <h1 className="primary-header">Contacts</h1>
            <Contacts showProfile={this.showProfile}/>
            <Messages/>
          </div>
        )  
        case "events":
        return (
          <div>
            <h1 className="primary-header" >Events</h1>
            <Events/>
          </div>
        )
        case "groups":
          return (
            <div>
              <h1 className="primary-header" >Group</h1>
              <Group/>
            </div>
            ) 
          case "users":
            return (
              <div>
                <h1 className="primary-header" >Users</h1>
                <Users/>
              </div>
                )  
          default:
            return;
    }
  }  

  render() {
    let messages = this.state.messages
    console.log(this.state.friend);
    
    return (
      <div>
          <main className="chatroom">
          <LeftNav 
            albums={this.state.albums}
            navLinkChangeHandler={this.navLinkChangeHandler}  
            className="navigation"/>
            <div className="chatroom__left-section">
              {this.navComponents()}
            </div>
            <div className="chatroom__main-section">
              <div className="chat-area-header">
                <div className="icon">
                  <div className={this.state.switchButton["location"] ? "" : "strike" }>

                  </div>
                  <FontAwesomeIcon 
                      onClick={()=>this.switchButton("location" )} 
                      icon={faLocationArrow}/>

                </div>
                <div className="icon">
                  <div>
                  </div>
                  <a 
                    href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
                    "%20"
                      )}&response_type=token&show_dialog=true`}>
                    <FontAwesomeIcon icon={faMusic}/>
                  </a>
                </div>
              </div>
              <ChatArea>
                {this.state.messages.map((message) =>(
                  <ChatMessenger message={message}
                    location = {this.state.location}/>
                  ))
                }
              </ChatArea>
              <ChatBox getMessage={this.setMessage} 
                recipient={this.state.friend}/>
            </div>
            <div className="chatroom__right-section">
              {this.state.friend &&
                <Profile userData={this.state.friend}/>
              }
            </div>
          </main>
      </div>
    )
  }
}

export default Chatroom
