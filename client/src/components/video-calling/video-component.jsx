import React,{Component} from 'react'
import axios from "axios";
import { socket } from '../../services/socketIo';
import Room from './room.component';


export default class VideoComponent extends Component {
    constructor (props) {
        super(props)
        this.state = {
            users:[],
            token:""

        }
    }

    componentDidMount(){
      
      const {caller, calling, room, currentUser, incomingCalling} = this.props 
      if (!incomingCalling){         
            socket.emit("voiceCall", { calling, caller, room})
    
  
      }
      this.setState({caller, calling, room,incomingCalling, currentUser})
      let body ={ 
        room: this.state.roomName,
        identity: currentUser
      
      }
      axios.post('/video-token', body).then(results => {
        let token = results.data.message.token
        this.setState({token: token, });
          })
    }

    addUser = (user) =>{
        this.setState((prevState) => ({
            users:[...prevState.users, user]
        }))
    }
    
  render() {
    const {caller, calling, room, currentUser, incomingCalling, token} = this.state 
    return (
      <div>{
          (token) &&
          <div>
            <Room roomName={room} token={token}/>
         </div>   
        }
      </div>
    )
      }
    }
