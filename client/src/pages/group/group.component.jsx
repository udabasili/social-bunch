import React, { Component } from 'react';
import {withRouter} from "react-router-dom"
import Profile from "../../components/profile/profile.component";
import ChatMessenger  from '../../components/chat-messages/chat-messages.component';
import ChatSendBox from "../../components/chat-send-box/chat-send-box.component";
import {connect} from "react-redux";
import { getGroupMembersById } from '../../redux/action/group.action';
import { socket, setRooms } from '../../services/socketIo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';



class GroupPage extends Component {
    constructor (props) {
    super(props)
    this.state = {
      messages:[],
      groupMembers:props.room.members,
      groupId:props.match.params.groupId,
      currentUser:props.currentUser,
      onlineMembers:[],
      showProfile:false,
      user:null

        }
      };

    componentDidMount() {
      socket.on('groupMessage', this.setMessage)
      socket.on("users", this.users)
      socket.on("updateRoomMemberStatus", this.updateStatus)
      const {currentUser, groupId } = this.state
      let username = currentUser.username      
      this.props.getGroupMembersById(groupId)
      console.log(groupId);
      
      socket.emit("join", {username, groupId}, (response) => {  
        console.log(response.socket[0].users)      
        this.setState((prevState) => ({          
          onlineMembers:[...response.socket[0].users]
            })
          )   
        })
      this.setRooms(username)
      
     

    }

    componentWillUnmount(){
      let roomId = this.state.groupId;
      let username= this.state.currentUser.username;
      //update online users in the group when anyone leaves
      socket.emit('leave', { username, roomId }, (response) => {
          socket.on("updateRoomMemberStatus", this.updateStatus)

      })
    }

    setRooms = (username) => {
      this.props.getGroupMembersById(this.state.groupId)
        .then((response) => {
          console.log(response);
          
            this.setState((prevState) => ({
              groupMembers:[...response.members]
              })
            )
        })
      }

    updateStatus = (response) =>{      
      console.log(response);
      
      this.setState((prevState) => ({
        onlineMembers:[...response.socket[0].users]

        })
      )
        
    }

    showProfile = (user) =>{
       user = this.props.users.filter((u) => u.username === user)[0]
      this.setState({ user})
    }
    
    setMessage = (message) =>{
      
      this.setState(prevState => ({
        ...prevState,
        messages: [...prevState.messages, message]
      })
      )
    }

    render() {
      const {user, messages, groupMembers, onlineMembers, groupId} =this.state
        console.log(groupMembers, onlineMembers);
        
        return (
            <div className="group">
                <section className="group__left-section">
                    <Profile userData={user} groupChat/>
                </section>
                <section className="chatroom__main-section">
                  <div className="chat-container">
                    <div className="chat-area-header">
                    </div>
                    <div className="chat-area" ref={this.chatArea}>
                      { messages &&
                        messages.map((message) =>(
                          <ChatMessenger message={message}/>
                          ))
                      }
                      </div>
                    </div>
                  <ChatSendBox getMessage={this.setMessage} groupId={groupId}/>
                </section>
                <section className="group__right-section">
                <div>
                    <h2 className="primary-header">Group Members</h2>
                    <ul className="w3-ul w3-card-4">
                      {groupMembers.map((member)=>(
                        <li className="w3-bar" onClick={() => this.showProfile(member)}>
                        <span 
                          className={`user-group-status
                            ${onlineMembers.some(onlineMember => onlineMember.username === member) ? 
                            "online" : 
                            "offline"}`}>
                          </span>
                        <FontAwesomeIcon icon={faUser}/>
                        <div class="w3-bar-item">
                          <span class="w3-large">{member}</span><br></br>
                        <span>{}
                          </span>
                        </div>
                      </li>
                      ))}
                    </ul>
                  </div>
                </section>
            </div>
        )
    }
}

const mapStateToProps = (state) =>({
    currentUser:state.user.currentUser,
    users: state.user.users,
    room:state.groups.room

 })
 
 const mapDispatchToProps = dispatch => ({
   getGroupMembersById: id => dispatch(getGroupMembersById(id))
 })


export default withRouter(connect(mapStateToProps , mapDispatchToProps)(GroupPage));