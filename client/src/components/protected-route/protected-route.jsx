import  React from 'react'
import {Route, Redirect} from "react-router-dom";
import {connect} from "react-redux";
import Header from "../../components/header/header";


const PrivateRoute = ({ component: Component, currentUser, ...rest }) => {    
    return (
    <Route {...rest} render={(props) => (
       sessionStorage.getItem("validator") && currentUser
        ? <div>
            <Header/>
            <Component {...props} />
        </div>
        : <Redirect to={{
            pathname:"/auth",
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