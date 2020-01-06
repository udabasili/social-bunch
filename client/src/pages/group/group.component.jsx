import React, { Component } from 'react';
import {withRouter} from "react-router-dom"
import Profile from "../../components/profile/profile.component";
import ChatArea from '../../components/chat-area/chat-area.component';
import ChatMessenger  from '../../components/chat-messages/chat-messages.component';
import ChatBox from "../../components/chat-box/chat-box.component";
import { socket, getGroupById, setRooms } from '../../nodeserver/node.utils';
import {connect} from "react-redux";


class GroupPage extends Component {
    constructor (props) {
    super(props)
    this.state = {
      messages:[],
      groupMembers:[],
      onlineMembers:[],
      showProfile:false,
      friend:null

        }
      };
    componentDidMount() {
      let groupId = this.props.match.params.groupId;
      let username= this.props.currentUser.username;
      socket.emit("join", {username, groupId}, (response) => {
        this.setState((prevState) => ({
          onlineMembers:[...response.socket[0].users]
            })
          )   
        })
      socket.on('newMessage', this.setMessage)
      socket.on("users", this.users)
      setRooms(username)
      getGroupById(this.props.match.params.groupId)
        .then((response) => {
            this.setState((prevState) => ({
              groupMembers:[...response.members]
              })
            )
        })
    socket.on("onlineUsersStatus", this.updateStatus)

        
    }

    componentWillUnmount(){
      let roomId = this.props.match.params.groupId;
      let username= this.props.currentUser.username;
      socket.emit('leave', { username, roomId }, (response) => {
          socket.on("onlineUsersStatus", this.updateStatus)

      })
    }

    updateStatus = (response) =>{
      console.log(response);
      
      this.setState((prevState) => ({
        onlineMembers:[...response.socket[0].users]

        })
      )
        
    }


    //Get the user location
  
    showProfile = (value) =>{
      this.setState({
        friend: value
      })
    }
    
    setMessage = (message) =>{
      this.setState(prevState => ({
        ...prevState,
        messages: [...prevState.messages, message]
      })
      )
    }

    render() {
        let groupId = this.props.match.params.groupId        
        return (
            <div className="group">
                <section className="group__left-section">
                  {this.state.friend &&
                    <Profile userData={this.state.friend}/>
                  }
                </section>
                <section className="chatroom__main-section">
                <ChatArea>
                {this.state.messages.map((message) =>(
                  <ChatMessenger message={message}/>
                  ))
                }
              </ChatArea>
              <ChatBox getMessage={this.setMessage} groupId={groupId}/>
                </section>
                <section className="group__right-section">
                  <ul>
                    {this.state.groupMembers.map((member)=>(
                      <li>
                       <span>{member}</span>
                       <span>{this.state.onlineMembers.some(onlineMember => onlineMember.username === member) ? 
                          "online" : 
                          "offline"}
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>
            </div>
        )
    }
}

const mapStateToProps = (state) =>({
    currentUser:state.user.currentUser,
 })
 


export default withRouter(connect(mapStateToProps , null)(GroupPage));