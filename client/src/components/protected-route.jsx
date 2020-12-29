import  React from 'react'
import {Route, Redirect} from "react-router-dom";
import {connect} from "react-redux";

/**
  * @desc ensures that the current user can only access route when he is logged in and authenticated
  * @param props of component, currentUser and other things

*/

const PrivateRoute = ({ component: Component, currentUser, isAuthenticated, ...rest }) => {    
    console.log(sessionStorage.getItem("validator") && isAuthenticated)

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
 


export default connect(mapStateToProps , null)(PrivateRoute)