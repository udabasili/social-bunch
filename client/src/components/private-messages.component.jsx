import React, {  PureComponent } from 'react'
import {connect} from 'react-redux';
import { receivePrivateMessage, unRegisterReceivePrivateMessage } from '../services/socketIo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faUser } from '@fortawesome/free-solid-svg-icons';
import  ChatMessenger  from './chat-messages.component';
import ChatSendBox from './chat-send-box.component';
import { getMessages } from '../redux/action/message.action';
import { getLocation } from '../redux/action/user.action';
import { Link } from 'react-router-dom';

/**
  * Handles messages between two users
*/
 
class PrivateMessages extends PureComponent {
	constructor (props) {
		super(props);
		this.chatArea = React.createRef()
		this.state ={
		  currentUser:props.currentUser,
		  location:null,
		  messages:null
		}
	}

	componentDidMount(){
	  receivePrivateMessage(this.setReceivedMessage);    
		this.props.getMessages(this.state.currentUser._id, this.props.recipient._id)
		.then((messages) =>{
			this.setState((prevState) => ({
				...prevState,
				messages
			}), () => this.scrollToBottom())
		})
		.catch(() =>{

		})
	  
	}

	componentDidUpdate(prevState, prevProps){
		if (this.props.recipient._id !== prevState.recipient._id){
			this.props.getMessages(this.state.currentUser._id, this.props.recipient._id)
				.then((messages) => {
					this.setState((prevState) => ({
						...prevState,
						messages
					}), () => this.scrollToBottom())
				})
				.catch(() => {

				})
		}
	}


	componentWillUnmount(){
	  unRegisterReceivePrivateMessage()
	}

	/**
	 * scroll to the bottom of the chat window
	 */
	scrollToBottom = () =>{
	  this.chatArea.current.scroll(0, this.chatArea.current.scrollHeight)
	}

	/**
	 * add message that is sent to this user to the message list
	 * @param {*} message 
	 */
	setReceivedMessage = ({ messages, receiver, sender}) =>{ 
		const { currentUser } = this.props
		console.log(receiver, currentUser._id, sender  )
		if (receiver === currentUser._id || sender === currentUser._id) {

			this.setState((prevState) => ({
				...prevState,
				messages
			}), () => this.scrollToBottom())
		}
		

	}

	/**
	 * activate the get location with geolocation api when turned on
	 * @param {*} type 
	 */
	

	getUserLocation = () => {
		if (!navigator.geolocation) {
			return alert("Sorry this browser doesn't support geolocation")
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
		const {recipient} = this.props;
		return (
			<div className='chat'>
			<div className='chat__header'>
				<div className="user">
					<img
							src={recipient.image || recipient.userImage}
						alt="your profile"
						className="user__photo" />
					<div className="user__detail">
						<span className="username">{recipient.username}</span>
						<span className="status">{recipient.username}</span>
					</div>
				</div>
				<div className='icons'>
					<Link
						to={{
							pathname: `/user/${recipient._id}/profile`,
							state: { userData: recipient }
						}}
					>
						<FontAwesomeIcon
							className='icon'
							icon={faUser} />
					</Link>
				</div>
			</div>
			<div className='chat__messages' ref={this.chatArea}>
				{ messages && messages.map((message) =>(
					<ChatMessenger message={message}
					location = {this.state.location}/>
					))
					}
			</div>
			<ChatSendBox 
				location={this.state.location}
				recipient={recipient}/>
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