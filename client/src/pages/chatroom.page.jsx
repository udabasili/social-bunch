import React, { PureComponent } from 'react';

import {connect} from 'react-redux';
import PrivateMessages from '../components/private-messages.component';
import { getMessages } from '../redux/action/message.action';
import { 
  receivePrivateMessage,
  unRegisterReceivePrivateMessage,
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
			hideUsersforMobile: false,
			isMobile: window.innerWidth <= 900,
			messages: new Array(0),
			room:null,
			friend:null,
			receiverId: null
		};
    }


	componentDidMount() {
		window.addEventListener('resize', this.dimensionChange)
		receivePrivateMessage(this.setReceivedMessage)

	}


	componentWillUnmount() {
		window.removeEventListener('resize', this.dimensionChange)
		unRegisterReceivePrivateMessage()

	}

	dimensionChange = () =>{
		this.setState(prevState =>({
			...prevState,
			isMobile: window.innerWidth <= 900
		}))
	}
	
	
	


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
			console.log(user)
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
				

	}

	showUserMessagesHandler = (friend) => {
		console.log(this.props.currentUser._id, friend._id,"ii")
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

	

	hideUsersforMobileHandler = (value) =>{
		this.setState(prevState =>({
			...prevState,
			hideUsersforMobile: value,
			friend: value === true && null,
			showUserMessages: value === false && null,
		}))
	}
	

	navLinkChangeHandler = (value) => {    
		this.setState({currentLink: value}, this.toggleLeftSection(false))
	}

	render() {
		const {isMobile, hideUsersforMobile} = this.state;
		return (
			<React.Fragment>
				<HomeAside>
						<h1 className='secondary-header'>Contacts</h1>
						{
							!isMobile ?
								<Contacts 
								hideUsersforMobileHandler={this.hideUsersforMobileHandler}
								showMessages={this.showUserMessagesHandler} /> :
								!hideUsersforMobile  &&
									<Contacts 
										hideUsersforMobileHandler={this.hideUsersforMobileHandler}
										showMessages={this.showUserMessagesHandler} />

						}
						
					<UserMessageHistory showMessages={this.showUserMessagesHandler} />
				</HomeAside>
					{ this.state.friend && this.state.showUserMessages &&
						<div className='chatroom'>
							<PrivateMessages 
								hideUsersforMobileHandler={this.hideUsersforMobileHandler}
								hideUsersforMobile={hideUsersforMobile}
								isMobile={isMobile}
								recipient= {this.state.friend}
								currentUser = {this.props.currentUser}/>
						</div>
					}
			</React.Fragment>
		)
	}
}

const mapStateToProps = (state) =>({
  errors : state.errors,
  allUsers: state.user.users,


})

const mapDispatchToProps = dispatch => ({
  getMessages: (userId, recipientId) => dispatch(getMessages(userId, recipientId)),
  loadMessages: (messages) => dispatch(getMessages(messages))


})


export default connect(mapStateToProps , mapDispatchToProps)(Chatroom);