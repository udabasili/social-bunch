import React, { Component } from "react"; 
import { Switch} from "react-router-dom";
import Group from "../components/group.component";
import LeftNav from "../components/left-nav.components";
import ProtectedRoute from "../components/protected-route";
import {
  connectOnAuth,
  newUserListener,
  setOnlineUsers,
} from "../services/socketIo";
import ChatRoom from "./chatroom.page";
import EventPage from "./event.pages";
import UsersPage from "./users.page";
import { connect } from "react-redux";
import { setAllUsersStatus, verifyUser } from "../redux/action/user.action";
import { toast } from "react-toastify";


class Home extends Component {

    componentDidMount(){
        const { currentUser, setAllUsersStatus } = this.props
        newUserListener(this.newUserAdded)
        connectOnAuth(currentUser.username)
          setOnlineUsers((response => {
            setAllUsersStatus(response.users, response.usersStatus)
          }
        ))
        
	}
	
	newUserAdded = () =>{
			this.props.verifyUser()
				.then(() =>{
				})
				.catch(res => console.log(res))
		toast.info('New User Joined')
	}
  render() {
      const { currentUser, isAuthenticated } = this.props
		return (
			<div className='content'>
				<LeftNav/>
				<main className='home'>
					<Switch>
					<ProtectedRoute exact currentUser={currentUser} isAuthenticated={isAuthenticated} path="/" component={ChatRoom} />
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



})

export default connect(null, mapDispatchToProps)(Home)