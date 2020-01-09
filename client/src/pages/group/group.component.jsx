import React, { Component } from 'react';
import {withRouter} from "react-router-dom"
import Profile from "../../components/profile/profile.component";
import ChatArea from '../../components/chat-area/chat-area.component';
import ChatMessenger  from '../../components/chat-messages/chat-messages.component';
import ChatBox from "../../components/chat-box/chat-box.component";
import {connect} from "react-redux";
import { getGroupById } from '../../redux/action/group.action';
import { socket, setRooms } from '../../services/socketIo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';



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
      this.props.getGroupById(this.props.match.params.groupId)
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
      //update online users in the group when anyone leaves
      socket.emit('leave', { username, roomId }, (response) => {
          socket.on("onlineUsersStatus", this.updateStatus)

      })
    }

    updateStatus = (response) =>{      
      this.setState((prevState) => ({
        onlineMembers:[...response.socket[0].users]

        })
      )
        
    }

    showProfile = (user) =>{
      let friend = this.props.users.filter((u) => u.username === user)
      friend = (friend[0]);
      
      this.setState({ friend:{
          friend: friend
          
        }
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
                    <Profile userData={this.state.friend}/>
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
                <div>
                    <h2 className="primary-header">Group Members</h2>
                    <ul className="w3-ul w3-card-4">
                      {this.state.groupMembers.map((member)=>(
                        <li className="w3-bar" onClick={() => this.showProfile(member)}>
                        <span 
                          className={`user-group-status
                            ${this.state.onlineMembers.some(onlineMember => onlineMember.username === member) ? 
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
    users: state.user.users
 })
 
 const mapDispatchToProps = dispatch => ({
   getGroupById: id => dispatch(getGroupById(id))
 })


export default withRouter(connect(mapStateToProps , mapDispatchToProps)(GroupPage));