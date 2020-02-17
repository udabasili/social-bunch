import React, { Component } from 'react'
import {connect} from "react-redux";
import { socket } from '../../services/socketIo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationArrow, faMusic } from '@fortawesome/free-solid-svg-icons';
import  ChatMessenger  from '../chat-messages/chat-messages.component';
import ChatSendBox from "../chat-send-box/chat-send-box.component";
import { getMessages } from '../../redux/action/message.action';
import { getLocation } from '../../redux/action/user.action';
import { authEndpoint, clientId, redirectUri, scopes } from "../../components/spotify/config";



/**
  * @desc show  all messages between a user and his friend  between past and present
  * friends list to User Icon as props
  * @param props for the toggle button of showing and hiding profile window and current user from redux

*/
 
class PrivateMessages extends Component {
    constructor (props) {
        super(props);
        this.chatArea = React.createRef()
        this.state ={
            currentUser:props.currentUser,
            recipient:props.recipient,
            location:null,
            switchButton:{location:false},
            messages:props.messages
        }
    }


    componentDidMount(){        
      socket.on('privateMessage', this.setReceivedMessage)
        this.scrollToBottom()
        this.props.getMessages(this.state.currentUser._id, this.state.recipient._id)
    }

    componentDidUpdate(prevProps) {
      //update message list with new message props and scroll to the bottom
        if (this.props.messages !== prevProps.messages) {
            this.setState((prevState) =>({
                ...prevState,
                messages: this.props.messages
            }), () =>  this.scrollToBottom()
            )
        }

    }

    scrollToBottom = () =>{
        this.chatArea.current.scroll(0, this.chatArea.current.scrollHeight)
    }
    //add message that is sent to this user to the message list
    setReceivedMessage = (message) =>{      
          this.setState(prevState => ({
            ...prevState,
            messages: [...prevState.messages, message ]
        }), () => this.scrollToBottom()
      )}
    //toggle location button off and on
  // activate the get location with geolocation api when turned on
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


  getUserLocation = () => {
    if (!navigator.geolocation) {
        return alert("Sorry this browser doesn't support geolocation ")
    }    

    navigator.geolocation.getCurrentPosition((position)=>{
        let lat = position.coords.latitude
        let long = position.coords.longitude
        let coords = {lat, long}
        this.props.getLocation(coords)
          .then((res)=>{
            this.setState((prevState)=>({
                ...prevState,
                  location: res
                })
            )
          })
        })
    }
  
    
    render() {
        const {messages} = this.state;

        return (
            <div className="chat-container">
            <div className="chat-area-header">
                <div>
                    {this.state.recipient.username}
                </div>
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
              <div className="chat-area" ref={this.chatArea}>
               { messages &&
                messages.map((message) =>(
                  <ChatMessenger message={message}
                    location = {this.state.location}/>
                  ))
                    }
              </div>
              <ChatSendBox 
                location={this.state.location}
                recipient={this.state.recipient}/>
            </div>
            
        )
    }
}

const mapStateToProps = (state) =>({
    currentUser:state.user.currentUser,
    errors : state.errors,
    allUsers: state.user.users,
    messages: state.messages.messages
  
  })
  
  const mapDispatchToProps = dispatch => ({
    getLocation: (coords) => dispatch(getLocation(coords)) , 
    getMessages: (userId, recipientId) => dispatch(getMessages(userId, recipientId)),
    

  
  })


export default connect(mapStateToProps , mapDispatchToProps)(PrivateMessages);