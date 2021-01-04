import React from 'react';
import {Switch, Route, withRouter, Redirect} from "react-router-dom"
import Auth from "./pages/auth.page";
import GroupChatPage from "./pages/groupchat.page";
import {setRestApiHeader, setAllUsersStatus, verifyUser, setCurrentUser, setAllUsers, } from "./redux/action/user.action";
import PrivateRoute from "./components/protected-route";
import {connect} from "react-redux";
import ProfilePage from "./pages/profile-pages.page";
import {
  setRooms, 
  unRegisterSetOnlineUsers, 
  UnRegistersetAllUsersListener,
  UnRegisterChangeOnlineUsers,
  setAllUsersListener, 
  UnregisterCurrentUserUpdateListener,
  UnRegisterSetUserInfo,
  startIOConnection,
  disconnectSocket} from "./services/socketIo";
import NotFoundPage from './components/not-found';
import Navigation from './components/navigation';
import { removeError } from './redux/action/errors.action';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddProfile from './pages/add-profile.page';
import Home from './pages/home.page';
import axios from "axios";


if (sessionStorage.getItem("validator")) {  
    setRestApiHeader(sessionStorage.getItem("validator"));
  }
  

class MainRouter extends React.Component {
	

	componentDidMount(){
		startIOConnection()
		
		const { history, removeError } = this.props
		window.addEventListener('beforeunload', this.handleUnload);
		this.unregisterHistory = history.listen(() => {
			removeError()
		})
		
		setAllUsersListener(this.setAllUsersHandler)
		setRooms()
	}

	componentWillUnmount(){
		this.unregisterHistory()
		window.removeEventListener('beforeunload', this.handleUnload);
		
		
	}

	handleUnload(){
		unRegisterSetOnlineUsers()
		UnRegisterSetUserInfo()
		UnRegistersetAllUsersListener()
		UnRegisterChangeOnlineUsers()
		UnregisterCurrentUserUpdateListener()
		disconnectSocket()

	}


  
	setAllUsersHandler = (users) =>{
		this.props.setAllUsers(users)
	}


  
	render(){
		const {currentUser, isAuthenticated} = this.props
		const authCheck = sessionStorage.getItem("validator") && isAuthenticated

		return (
			<React.Fragment>
				{ authCheck && < Navigation />}
				<ToastContainer
					position="top-center"
					autoClose={3000}
				/>
				<Switch>
					<Route path="/auth/login" render={props => (
						authCheck ?
							<Redirect to="/" /> :
							<Auth auth="login" {...props} />
						)
					} />
					<Route path="/auth/register" render={props => (
						authCheck ?
							<Redirect to="/" /> :
							<Auth auth="register" {...props} />
						)
					} />
					<Route exact path="/profile/:userId/add" render={props => (
						<AddProfile type="add" currentUser={currentUser} {...props} />
					)
					} />
					<Route exact path="/profile/:userId/edit" render={props => (
						<AddProfile type="edit" currentUser={currentUser} {...props} />
					)
					} />
					<PrivateRoute exact currentUser={currentUser}  
						isAuthenticated={isAuthenticated} 
						path="/groups/:groupId" component={GroupChatPage} />
					<PrivateRoute exact 
						currentUser={currentUser} 
						isAuthenticated={isAuthenticated}
						path="/user/:userId/profile" component={ProfilePage} />
					<Route path='/' render={(props) =>(
						sessionStorage.getItem("validator") && isAuthenticated ?
							<Home isAuthenticated={isAuthenticated} currentUser={currentUser} {...props}/> :
							<Redirect to="/auth/register" />
						)}/>
				
					
					
					<Route path="/404" component={NotFoundPage} />
					<Redirect to="/404" />
				</Switch>
			</React.Fragment>
			);
	}
}
  
  const mapStateToProps = (state) =>({
    currentUser:state.user.currentUser,
    isAuthenticated:state.user.isAuthenticated,
 })


const mapDispatchToProps = (dispatch) =>({
  setAllUsersStatus: (users, usersStatus) => dispatch(setAllUsersStatus(users, usersStatus)),
  verifyUser: () => dispatch(verifyUser()),
  setCurrentUser:(user) => dispatch(setCurrentUser(user)),
  removeError: () => dispatch(removeError()),
  setAllUsers: (users) => dispatch(setAllUsers(users))


})
  
  export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MainRouter));