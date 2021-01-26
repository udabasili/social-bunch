import React, { Component } from 'react';
import {withRouter} from 'react-router-dom'
import ChatMessenger  from '../components/chat-messages.component';
import ChatSendBox from '../components/chat-send-box.component';
import {connect} from 'react-redux';
import { getGroupMembersById } from '../redux/action/group.action';
import { 
	receiveMessageForGroup,
	unRegisterUpdateRoomMembersStatus,
	updateRoomMembersStatus,
	enterRoom,
	exitRoom,
	unRegisterReceiveMessageForGroup, 
	setSocket,
	setOnlineUsers,
	currentUserUpdateListener} from '../services/socketIo';
import { BiLogInCircle } from "react-icons/bi";
import { setAllUsersStatus } from '../redux/action/user.action';

class GroupPage extends Component {
	constructor (props) {
	super(props)
	this.state = {
		messages:[],
		groupMembers:props.room.members,
		groupId:props.match.params.groupId,
		currentUser:props.currentUser,
		onlineMembers:[],
		groupName: this.props.location.state ? this.props.location.state.groupName : '',
		showProfile:false,
		user:null
		}
	};

	leaverGroup = () =>{
		this.props.history.push("/")
	}

	updateRoomMembersStatus = (response) =>{    
		this.props.getGroupMembersById(this.state.groupId)
		.then(res => {
			this.setState((prevState) => ({
			...prevState,
			onlineMembers:[...response.users],
			groupMembers:[...res.members]
			})
			)
		})
	}
  
  componentDidMount() {
    const {currentUser, groupId } = this.state;
    let username = currentUser.username;      
    setSocket(currentUser.username)
    receiveMessageForGroup(this.setGroupMessages)
    updateRoomMembersStatus(this.updateRoomMembersStatus)
    enterRoom(username, groupId);
    this.props.getGroupMembersById(groupId)
    this.setRooms(username)
  }

  componentWillUnmount(){
    unRegisterReceiveMessageForGroup()
    unRegisterUpdateRoomMembersStatus()
    let roomId = this.state.groupId;
    let username= this.state.currentUser.username;
    exitRoom(username, roomId)
  }

  setRooms = () => {
    this.props.getGroupMembersById(this.state.groupId)
		.then((response) => {          
			this.setState((prevState) => ({
				...prevState,
				groupMembers:[...response.members]
            })
          )
      }
    )
  }

  showProfile = (user) =>{
    user = this.props.users.filter((u) => u.username === user)[0]
    this.setState({ user})
  }
  
  setGroupMessages = (message) =>{  
    this.setState(prevState => ({
      ...prevState,
      messages: prevState.messages.concat(message)
    })
    )
  }

  render() {
    const {messages, groupMembers, onlineMembers, groupId, groupName} =this.state        
      return (
        <div className="groupchat">
          <div className="groupchat__members">
            <ul className="groupchat__list">
              {groupMembers.map((member) => (
                <li
                  className="groupchat__item"
                >
                  {/* <span
                    className={`groupchat__status
                          ${
                            onlineMembers.some(
                              (onlineMember) => onlineMember.username === member
                            )
                              ? "online"
                              : "offline"
                          }`}
                  ></span> */}
                  <div className="groupchat__name">
                    <span>{member}</span>
                    <br></br>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className='chat groupchat__chat'>
            <div className='chat__header'>
              <div className="user">
                <div className="user__detail">
                  <span className="username">{groupName}</span>
                </div>
              </div>
				<BiLogInCircle className='logout' title='Leave group' onClick={this.leaverGroup} />
            </div>
            <div className='chat__messages' ref={this.chatArea}>
              {messages && messages.map((message) => (
                <ChatMessenger message={message}
                  location={this.state.location} />
              ))
              }
            </div>
            <ChatSendBox
              getMessage={this.setGroupMessages} groupId={groupId}/>
          </div>
          
        </div>
      );
  }
}

const mapStateToProps = (state) =>({
    currentUser:state.user.currentUser,
    users: state.user.users,
    room:state.groups.room

 })
 
const mapDispatchToProps = dispatch => ({
  	getGroupMembersById: id => dispatch(getGroupMembersById(id)),
    setAllUsersStatus: (users, usersStatus) => dispatch(setAllUsersStatus(users, usersStatus)),

})


export default withRouter(connect(mapStateToProps , mapDispatchToProps)(GroupPage));