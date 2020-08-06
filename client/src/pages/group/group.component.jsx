import React, { Component } from 'react';
import {withRouter} from 'react-router-dom'
import ChatMessenger  from '../../components/chat-messages/chat-messages.component';
import ChatSendBox from '../../components/chat-send-box/chat-send-box.component';
import {connect} from 'react-redux';
import { getGroupMembersById } from '../../redux/action/group.action';
import { 
	receiveMessageForGroup,
	unRegisterUpdateRoomMembersStatus,
	updateRoomMembersStatus,
	enterRoom,
	exitRoom,
	unRegisterReceiveMessageForGroup } from '../../services/socketIo';

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
    const {user, messages, groupMembers, onlineMembers, groupId} =this.state        
      return (
        <div className="group">
          <section className="group__left-section">
            <h2 className="primary-header">Group Members</h2>
            <ul className="group-user__list">
              {groupMembers.map((member) => (
                <li
                  className="group-user__item"
                >
                  <span
                    className={`group-user__status
                          ${
                            onlineMembers.some(
                              (onlineMember) => onlineMember.username === member
                            )
                              ? "online"
                              : "offline"
                          }`}
                  ></span>
                  <div className="group-user__name">
                    <span>{member}</span>
                    <br></br>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="chatroom__main-section">
            <div className="chat-container">
              <div className="chat-area-header"></div>
              <div className="chat-area" ref={this.chatArea}>
                {messages &&
                  messages.map((message) => (
                    <ChatMessenger message={message} />
                  ))}
              </div>
            </div>
            <ChatSendBox getMessage={this.setGroupMessages} groupId={groupId} />
          </section>
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
  getGroupMembersById: id => dispatch(getGroupMembersById(id))
})


export default withRouter(connect(mapStateToProps , mapDispatchToProps)(GroupPage));