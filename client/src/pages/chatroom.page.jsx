import React, { PureComponent } from 'react';
import { getAllGroups } from '../redux/action/group.action'
import {getAllUsers, setAllUsersStatus } from '../redux/action/user.action';
import { getAllEvents } from '../redux/action/event.action';
import {connect} from 'react-redux';
import { getLocation } from '../redux/action/user.action';
import PrivateMessages from '../components/private-messages.component';
import { getMessages } from '../redux/action/message.action';
import { getOnlineUsers, 
  setOnlineUsers,
  unRegisterSetOnlineUsers,
  changeOnlineUsers,
  receivePrivateMessage,
  unRegisterReceivePrivateMessage
  } from '../services/socketIo';
import HomeAside from '../components/home-aside.component';
import Contacts from '../components/contact.component';
import UserMessageHistory from '../components/user-message-history.component';


class Chatroom extends PureComponent {
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
		receivePrivateMessage(this.setReceivedMessage)
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
	// receiveMessageHandler = (message)  => {    
	// 	this.setState(prevState => ({
	// 	...prevState,
	// 	showUserMessages: true,
	// 	friend: message.senderProfile
	// 	})
	// )}

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

	setReceivedMessage = ({ messages, receiver , sender }) => {
		const {currentUser} = this.props
		console.log(receiver, currentUser._id)
		if(receiver === currentUser._id ){
			let user = currentUser.friends.find((friend, i) =>(
				friend._id === sender
				)
			)
			this.setFriendHandler(user)
			this.setState((prevState) => ({
				...prevState,
				showUserMessages: true,
				friend: {
					image: user.userImage,
					...user,
				}
			}))
		}
				
		// this.setState((prevState) => ({
		// 	...prevState,
		// 	messages
		// }), () => this.scrollToBottom())

	}

	showUserMessagesHandler = (friend) => {
		this.props.getMessages(this.props.currentUser._id, friend._id)
			.then(() => {
				this.setFriendHandler(friend)
				this.setState((prevState) => ({
					...prevState,
					showUserMessages: true,
					friend
				}))
			})
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
				<HomeAside>
						<h1 className='secondary-header'>Contacts</h1>
					<Contacts showMessages={this.showUserMessagesHandler} />
					<UserMessageHistory showMessages={this.showUserMessagesHandler} />
				</HomeAside>
				<div className='chatroom'>
				{ this.state.friend && this.state.showUserMessages &&
					<PrivateMessages 
					recipient= {this.state.friend}
					currentUser = {this.props.currentUser}/>
				}
				</div>
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
  getMessages: (userId, recipientId) => dispatch(getMessages(userId, recipientId)),
  loadMessages: (messages) => dispatch(getMessages(messages))


})


export default connect(mapStateToProps , mapDispatchToProps)(Chatroom);