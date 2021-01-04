import React, { Component } from "react"; 
import { Switch} from "react-router-dom";
import Group from "../components/group.component";
import LeftNav from "../components/left-nav.components";
import ProtectedRoute from "../components/protected-route";
import {
  setSocket,
  newUserListener,
  currentUserUpdateListener,
  getOnlineUsers,
  setOnlineUsers,
} from "../services/socketIo";
import { getAllGroups } from '../redux/action/group.action'
import { getAllEvents } from '../redux/action/event.action';
import ChatRoom from "./chatroom.page";
import EventPage from "./event.pages";
import UsersPage from "./users.page";
import { connect } from "react-redux";
import { getUser, setAllUsersStatus, setCurrentUser, getAllUsers, verifyUser } from "../redux/action/user.action";
import { toast } from "react-toastify";
import { setNotification, toggleDropdown } from "../redux/action/notification.action";
import FeedPage from "./feed.page";
import { getPosts } from "../redux/action/post.actions"
class Home extends Component {

    componentDidMount(){
		const { currentUser, 
				setAllUsersStatus,
				getPosts, 
				setCurrentUser, 
				setNotification, 
				getAllUsers, 
				getAllEvents, 
				getAllGroups } = this.props
		
		getPosts()
		setOnlineUsers((response => {
            setAllUsersStatus(response.users, response.usersStatus)
			}
		))
		newUserListener(this.newUserAdded)
		currentUserUpdateListener(({currentUser}) =>{
			setCurrentUser(currentUser)
		})
		setSocket(currentUser.username)
		getAllEvents()
		getAllUsers()
		getAllGroups()
		setNotification(currentUser.notifications)
        
	}

	componentDidUpdate(prevProps){
		if(this.props.currentUser !== prevProps.currentUser){
			this.props.setNotification(this.props.currentUser.notifications)
			setSocket(this.props.currentUser.username)
			getOnlineUsers()


		}
	}
	
	/**
	 * Get online users 
	 */


	newUserAdded = response => {
        this.props.setAllUsersStatus(response.users, response.usersStatus)
		toast.info('New User Joined')
	}
  render() {
      const { currentUser, isAuthenticated, toggleDropdown } = this.props
		return (
			<div className='content' onClick={() => toggleDropdown(false) }>
				<LeftNav/>
				<main className='home' >
					<Switch>
						<ProtectedRoute exact currentUser={currentUser} isAuthenticated={isAuthenticated} path="/" component={FeedPage} />
						<ProtectedRoute currentUser={currentUser} isAuthenticated={isAuthenticated} path="/chat" component={ChatRoom} />
						<ProtectedRoute currentUser={currentUser} isAuthenticated={isAuthenticated} path="/events" component={EventPage} />
						<ProtectedRoute exact currentUser={currentUser} isAuthenticated={isAuthenticated} path="/groups" component={ Group} />
						<ProtectedRoute currentUser={currentUser} isAuthenticated={isAuthenticated}path="/users" component={UsersPage } />
			</Switch>
		</main>
		
     </div>
    );
  }
}




const mapDispatchToProps = (dispatch) => ({
  	setAllUsersStatus: (users, usersStatus) => dispatch(setAllUsersStatus(users, usersStatus)),
	verifyUser: () => dispatch(verifyUser()),
	setNotification: (notifications) => dispatch(setNotification(notifications)),
	getPosts: () => dispatch(getPosts()),
	setCurrentUser:(user) => dispatch(setCurrentUser(user)),
	getUser:(user) => dispatch(getUser(user)),
	getAllEvents: () => dispatch(getAllEvents()),
	getAllGroups : () => dispatch(getAllGroups()),
	getAllUsers : () => dispatch(getAllUsers()),
	toggleDropdown : (value) => dispatch(toggleDropdown(value)),


})

export default connect(null, mapDispatchToProps)(Home)