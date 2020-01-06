import React from 'react';
import {Switch, Route, Redirect, withRouter} from "react-router-dom"
import './App.css';
import Auth from "./pages/auth/auth.component";
import GroupPage from "./pages/group/group.component";
import Chatroom from "./pages/chatroom/chatroom.component";
import {
  socket,
  verifyUser,
  getAllEvents, 
  getAllGroups,
   getAllUsers,
   setRooms,
   startIOConnection} from "./nodeserver/node.utils"
import {setCurrentUser } from "./redux/action/user.action";
import PrivateRoute from "./components/protected-route/protected-route";
import {connect} from "react-redux";

class App extends React.Component {
  constructor() {
    super();
 
}

componentDidMount() {
    
  verifyUser()
   ;
    
  if(localStorage.getItem("validator") && this.props.currentUser){  
      this.props.getAllGroups()
      this.props.getAllEvents()
      this.props.getAllUsers()
      let username = this.props.currentUser.username      
      startIOConnection()
      socket.emit("onload", username, function(response){
         console.log(response);
      })
      socket.emit("setRoomsByUser",  function(response){
        console.log(response);
      })
      
      
      
    }
    else{
      this.props.history.push("/auth")
    }
    

}
  render(){
    
    return (
      <div className="App">
        <Switch>
          <Route exact path="/auth" component={Auth}/>
          <PrivateRoute exact path="/" component={Chatroom} />
          <PrivateRoute exact path="/group/:groupId" component={GroupPage} />
        </Switch>
       
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) =>({
  getAllEvents: () => dispatch(getAllEvents()),
  getAllGroups : () => dispatch(getAllGroups()),
  getAllUsers : () => dispatch(getAllUsers()),
  setCurrentUser: user => dispatch(setCurrentUser(user)),


})

const mapStateToProps = (state) =>({
    currentUser:state.user.currentUser
 })


export default withRouter(connect(mapStateToProps , mapDispatchToProps)(App));
