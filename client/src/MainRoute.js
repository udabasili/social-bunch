import React from 'react';
import {Switch, Route, withRouter, Redirect} from "react-router-dom"
import Auth from "./pages/auth/auth.component";
import GroupPage from "./pages/group/group.component";
import Chatroom from "./pages/chatroom/chatroom.component";
import {setRestApiHeader, setAllUsersStatus, verifyUser, setCurrentUser, } from "./redux/action/user.action";
import PrivateRoute from "./components/protected-route/protected-route";
import {connect} from "react-redux";
import ProfilePage from "./pages/profile-pages/profile-pages.component";
import {connectOnAuth, setRooms, unRegisterSetOnlineUsers, setOnlineUsers, setUserInfo, UnRegisterSetUserInfo} from "./services/socketIo";
import NotFoundPage from './components/not-found/not-found';
import Header from './components/header/header';
const io = require('socket.io-client')
export const socket = io.connect('')

if (sessionStorage.getItem("validator")) {  
    setRestApiHeader(sessionStorage.getItem("validator"));
  }
  

class MainRouter extends React.Component {
  componentDidMount(){
    setOnlineUsers((response=>{
      setAllUsersStatus(response.users, response.usersStatus)
    }
  ))
      
  setRooms()
    if (sessionStorage.getItem("validator")) {  
      this.props.verifyUser()
      .then()
      .catch(res => this.props.history.push('/auth/login'))
      connectOnAuth(this.props.currentUser.username)
    } 
  }

  componentWillUnmount(){
    unRegisterSetOnlineUsers()
    UnRegisterSetUserInfo()
  }
  
  render(){
        const {currentUser, isAuthenticated} = this.props
  return (
    <React.Fragment>
      <Header/>
      <Switch>
        <PrivateRoute currentUser={currentUser} exact path="/" component={Chatroom} />
        <Route  exact path="/auth/login" render={props =>(
          sessionStorage.getItem("validator") && isAuthenticated ?
            <Redirect to="/"/> :
            <Auth auth="login" {...props}/>  
          )
        }/>
        <Route  exact path="/auth/register" render={props =>(
          sessionStorage.getItem("validator") && isAuthenticated ?
            <Redirect to="/"/> :
            <Auth auth="register" {...props}/>  
          )
      }/>
        <PrivateRoute exact currentUser={currentUser} path="/group/:groupId" component={GroupPage} />
        <PrivateRoute exact currentUser={currentUser} path="/user/:userId/profile" component={ProfilePage} />
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
  setCurrentUser:(user) => dispatch(setCurrentUser(user))

})
  
  export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MainRouter));