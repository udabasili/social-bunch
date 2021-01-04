import  React from 'react'
import {Route, Redirect, useHistory} from "react-router-dom";
import {connect} from "react-redux";
import axios from 'axios'
import { disconnectSocket, getOnlineUsers, setOnlineUsers } from '../services/socketIo';
import { setAllUsersStatus, setCurrentUser, setRestApiHeader } from '../redux/action/user.action';
import { setGroups } from '../redux/action/group.action';
import { setEvents } from '../redux/action/event.action';
import { toast } from 'react-toastify';

/**
  * @desc ensures that the current user can only access route when he is logged in and authenticated
  * @param props of component, currentUser and other things

*/

const PrivateRoute = ({ component: Component, currentUser, isAuthenticated, ...rest }) => {   
    const history = useHistory()
    axios.interceptors.response.use(
			response => response,
			error =>{
        console.log(error.response.data.message )
        if(error.response.data.message === 'jwt expired'){
              localStorage.clear()
            sessionStorage.clear()
            setCurrentUser({})
            setRestApiHeader(false)
            setAllUsersStatus([],[])
            setGroups(null)
            setEvents(null)
            getOnlineUsers()
            disconnectSocket()
            toast.error('Please login again')
        }
				throw error
			}
		) 

    return (
    <Route {...rest} render={(props) => (
        sessionStorage.getItem("validator") && isAuthenticated ? 
       <Component currentUser={currentUser} {...props} /> : 
       <Redirect to={{
            pathname:"/auth/login",
            state:{from: props.location}
            }}
        />
    )} />
    )
}
const mapStateToProps = (state) =>({
    currentUser:state.user.currentUser
 })
 
 
const mapDispatchToProps = (dispatch) =>({
  setAllUsersStatus: (users, usersStatus) => dispatch(setAllUsersStatus(users, usersStatus)),
  setCurrentUser:(user) => dispatch(setCurrentUser(user)),


})

export default connect(mapStateToProps , mapDispatchToProps)(PrivateRoute)