import React, { Component } from 'react';
import Profile from '../../components/profile/profile.component';
import {isBrowser} from 'react-device-detect';
import { getAllGroups } from '../../redux/action/group.action'
import {getAllUsers, setAllUsersStatus } from '../../redux/action/user.action';
import { getAllEvents } from '../../redux/action/event.action';
import {connect} from 'react-redux';
import { getLocation } from '../../redux/action/user.action';
import PrivateMessages from '../../components/private-messages/private-messages.component';
import { getMessages } from '../../redux/action/message.action';
import ChatroomLeftSection from '../../components/chatroom-left-section/chatroom-left-section';
import { getOnlineUsers, 
  setOnlineUsers,
  unRegisterSetOnlineUsers,
  changeOnlineUsers,
  receivePrivateMessage,
  unRegisterReceivePrivateMessage
  } from '../../services/socketIo';


class Chatroom extends Component {
	constructor (props) {
		super(props)
		this.state = {
		showUserMessages: false,
		showModal: false,
		messages: new Array(0),
		location:null,
		room:null,
		friend:null
		};
    }


	componentDidMount() {
		setOnlineUsers(this.setOnlineUsersHandler)
		changeOnlineUsers(this.updateOnlineUsers)
		getOnlineUsers()
		receivePrivateMessage(this.receiveMessageHandler)
		this.props.getAllGroups()
		this.props.getAllEvents()
		this.props.getAllUsers()
	}


	componentWillUnmount() {
		unRegisterReceivePrivateMessage()
		unRegisterSetOnlineUsers()
	}
	/**
	 * Hnadles the sending of message through socket
	 * @param {string} message 
	 */
	receiveMessageHandler = (message)  => {    
		this.setState(prevState => ({
		...prevState,
		showUserMessages: true,
		friend: message.senderProfile
		})
	)}

	/**
	 * Shows messages of the friend clicked from the friend list
	 * @param {*} user 
	 */
	setFriendHandler  = (user) => {
		this.setState((prevState, props)=>({
		...prevState,
		showUserMessages: true,
		friend:user
		}))
	}

	/**
	 * set the status of users to show who is online
	 * @param {*} user
	 */
	setOnlineUsersHandler = ({users, usersStatus}) => {    
		this.props.setOnlineUsers(users,usersStatus)
	}

	/**
	 * Get online users 
	 */
	updateOnlineUsers =()=> {
		getOnlineUsers()
	}
	

	navLinkChangeHandler = (value) => {    
		this.setState({currentLink: value}, this.toggleLeftSection(false))
	}

	render() {
		return (
			<React.Fragment>
				<main className='chatroom'>
					<ChatroomLeftSection
					setFriendHandler = {this.setFriendHandler} />
					<div className='chatroom__main-section'>
					{ this.state.friend && this.state.showUserMessages &&
						<PrivateMessages 
						recipient= {this.state.friend}
						currentUser = {this.props.currentUser}/>
					}
					</div>
				</main>
			</React.Fragment>
		)
	}
}

const mapStateToProps = (state) =>({
  errors : state.errors,
  allUsers: state.user.users,

})

const mapDispatchToProps = dispatch => ({
  getAllEvents: () => dispatch(getAllEvents()),
  getAllGroups : () => dispatch(getAllGroups()),
  getAllUsers : () => dispatch(getAllUsers()),
  getLocation: (coords) => dispatch(getLocation(coords)),
  setOnlineUsers: (users, usersStatus) => dispatch(setAllUsersStatus(users, usersStatus)),
  getMessages: (userId, recipientId) => dispatch(getMessages(userId, recipientId))


})


export default connect(mapStateToProps , mapDispatchToProps)(Chatroom);