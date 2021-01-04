import React, { Component } from "react"; 
import { Switch} from "react-router-dom";
import Group from "../components/group.component";
import LeftNav from "../components/left-nav.components";
import ProtectedRoute from "../components/protected-route";
import {
  setSocket,
  newUserListener,
  currentUserUpdateListener,
  setOnlineUsers,
} from "../services/socketIo";
import ChatRoom from "./chatroom.page";
import EventPage from "./event.pages";
import UsersPage from "./users.page";
import { connect } from "react-redux";
import { getUser, setAllUsersStatus, setCurrentUser, verifyUser } from "../redux/action/user.action";
import { toast } from "react-toastify";
import { setNotification, toggleDropdown } from "../redux/action/notification.action";
import FeedPage from "./feed.page";
import { getPosts } from "../redux/action/post.actions"

class Home extends Component {

    componentDidMount(){
		const { currentUser, setAllUsersStatus, getPosts } = this.props
		getPosts()
		this.props.setNotification(currentUser.notifications)
		newUserListener(this.newUserAdded)
		currentUserUpdateListener(({currentUser}) =>{
			this.props.setCurrentUser(currentUser)
		})
        setSocket(currentUser.username)
          setOnlineUsers((response => {
            setAllUsersStatus(response.users, response.usersStatus)
          }
        ))
        
	}

	componentDidUpdate(prevProps){
		if(this.props.currentUser !== prevProps.currentUser){
			this.props.setNotification(this.props.currentUser.notifications)

		}
	}
	
	newUserAdded = () =>{
		this.props.verifyUser()
			.then(() =>{})
			.catch(res => console.log(res))
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
	toggleDropdown : (value) => dispatch(toggleDropdown(value)),


})

export default connect(null, mapDispatchToProps)(Home)