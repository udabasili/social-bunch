import React from 'react';
import {Switch, Route, withRouter} from "react-router-dom"
import Auth from "./pages/auth/auth.component";
import GroupPage from "./pages/group/group.component";
import Chatroom from "./pages/chatroom/chatroom.component";
import { getAllGroups } from "./redux/action/group.action"
import {verifyUser, getAllUsers, setRestApiHeader } from "./redux/action/user.action";
import PrivateRoute from "./components/protected-route/protected-route";
import {connect} from "react-redux";
import ProfilePage from "./pages/profile-pages/profile-pages.component";
import {startIOConnection, socket} from "./services/socketIo";
import { getAllEvents } from './redux/action/event.action';


if (sessionStorage.getItem("validator")) {  
  setRestApiHeader(sessionStorage.getItem("validator"));
  
}

class App extends React.Component {
  constructor() {
    super();
  }


  componentDidMount() {    
    this.props.verifyUser().then(async()=>{   
        if(sessionStorage.getItem("validator") && this.props.currentUser){  
            this.props.getAllGroups()
            this.props.getAllEvents()
            this.props.getAllUsers()
            let username = this.props.currentUser.username      
            startIOConnection()
            socket.emit("onload", username, function(response){
          })
        }
    })
    .catch(() =>{
      this.props.history.push("/auth")

    })  
  }

  componentWillUnmount(){
    socket.disconnect()
  }


  render(){
    return (
      <div className="App">
        <Switch>
          <Route exact path="/auth" component={Auth}/>
          <PrivateRoute exact path="/" component={Chatroom} />
          <PrivateRoute exact path="/group/:groupId" component={GroupPage} />
          <PrivateRoute exact path="/user/:userId/profile" component={ProfilePage} />>
        </Switch>
       
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) =>({
  getAllEvents: () => dispatch(getAllEvents()),
  getAllGroups : () => dispatch(getAllGroups()),
  getAllUsers : () => dispatch(getAllUsers()),
  verifyUser: () => dispatch(verifyUser())



})

const mapStateToProps = (state) =>({
    currentUser:state.user.currentUser,
 })


export default withRouter(connect(mapStateToProps , mapDispatchToProps)(App));
