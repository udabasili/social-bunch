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
import { IoIosCloseCircle, IoIosCamera } from "react-icons/io";
import { toast } from 'react-toastify';
import { toggleDropdown } from '../redux/action/notification.action';

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
		  messages:[],
		  image:{
			name:null,
			data: null,
		  	isUploaded: false,
		  },
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

	appendInput = (message) =>{
		let currentMessages = this.state.messages
		currentMessages.push(message)
		this.setState( prevState => ({
			...prevState,
			image:{
				name:null,
				data: null,
				isUploaded: false,
				messages : [...currentMessages]

			},
		}), ()=> this.scrollToBottom() )

	}

	/**
	 * add message that is sent to this user to the message list
	 * @param {*} message 
	 */
	setReceivedMessage = ({ messages, receiver, sender}) =>{ 
		const { currentUser } = this.props
		if (receiver === currentUser._id || sender === currentUser._id) {

			this.setState((prevState) => ({
				...prevState,
				messages
			}), () => this.scrollToBottom())
		}
		

	}


	imageUpload = () =>{
		const imageInput = document.querySelector(".image-upload")
		const types = ['image/png', 'image/jpeg', 'image/jpg']
		let size = 5 * 1024 * 1024 
		imageInput.click()
		imageInput.onchange = (e) => {
			const files = imageInput.files
			if(!types.includes(files[0].type)){
				toast.error("Only png , jpeg and jpg images allowed ")
				return;
			}
			if(Number(files[0].size) > size){
				toast.error("Image can't be more than 5 MB ")
				return;
			}
			let fileName = imageInput.value.split('\\')[imageInput.value.split('\\').length - 1];

			this.setState( prevState => ({
				...prevState,
				image:{
					name:fileName,
					data: files[0],
					isUploaded: true,
				},
			}))
			
		}
	}

	
	
	render() {
		const {messages, image} = this.state;
		const {recipient, isMobile, usersStatus, hideUsersforMobileHandler, } = this.props;
		let currentUserStatus = usersStatus.find(user => user.username === recipient.username).isOnline || false
		
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
						<span className="status">{currentUserStatus ? "Online" : 'Offline'}</span>
					</div>
				</div>
				<div className='icons'>
					<div className='icon--upload'>
						<IoIosCamera className='icon' onClick={this.imageUpload}/>
						{
							image.isUploaded &&
								<p className='status'>
								</p>
						}
					</div>
				
					<input style={{display: 'none'}} 
						type='file' 
						accept='image/*' 
						className='image-upload'  />
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
					{
						isMobile &&
						<div className='icon--upload'>
							<IoIosCloseCircle className='icon close' onClick={() => hideUsersforMobileHandler(false)}/>
						</div>
					}
					
				</div>
			</div>
			<div className='chat__messages' ref={this.chatArea}>
				{ messages.length > 0 && messages.map((message) =>(
					<ChatMessenger message={message}
					recipient={recipient}
					location = {this.state.location}/>
					))
				}
			</div>
			<ChatSendBox 
				location={this.state.location}
				image={this.state.image.data}
				appendInput={this.appendInput}
				recipient={recipient}/>
		</div>
	  )
	}
}

const mapStateToProps = (state) =>({
  currentUser:state.user.currentUser,
  errors : state.errors,
  allUsers: state.user.users,
  messages: state.messages.messages,
  usersStatus: state.user.usersStatus
})
  
const mapDispatchToProps = dispatch => ({
	getLocation: (coords) => dispatch(getLocation(coords)) , 
	getMessages: (userId, recipientId) => dispatch(getMessages(userId, recipientId)),
	toggleDropdown : (showNotif) => dispatch(toggleDropdown(showNotif)),

})


export default connect(mapStateToProps , mapDispatchToProps)(PrivateMessages);