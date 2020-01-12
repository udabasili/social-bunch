import React,{Component} from 'react'
import axios from "axios";
import { socket } from '../../services/socketIo';
import Room from './room.component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhoneSlash, faPhone } from '@fortawesome/free-solid-svg-icons';


export default class VideoComponent extends Component {
    constructor (props) {
        super(props)
        this.state = {
            users:[],
            token: "",
            incomingCalling: props.incomingCalling,
            room: props.room,
            caller: props.caller,
            calling: props.calling,
            currentUser: props.currentUser
        }
    }

    componentDidMount(){
      
      const {caller, calling, room, incomingCalling} = this.state 
      if (!incomingCalling){         
            socket.emit("voiceCall", { calling, caller, room})
      }
      let body ={ 
        room: this.state.roomName,
        identity: this.state.currentUser
      
      }
      axios.post('/video-token', body).then(results => {
        let token = results.data.message.token
        this.setState({token: token})
        })
    }

    componentWillUnmount(){
      this.setState({token: null})

    }

    addUser = (user) =>{
        this.setState((prevState) => ({
            users:[...prevState.users, user]
        }
      ))
    }

    answerCallHandler = () =>{
      this.setState({
        incomingCalling: false
      })
    }
    
  render() {
    const {room, incomingCalling, token} = this.state 
    const {closeHandler} = this.props
    return (
      <div>{
        token &&
            incomingCalling ? 
              <div class="incoming-call">
                  <div class="incoming-call__ringing">
                      <div class="incoming-call__phone ">
                        <div class="incoming-call-circle"></div>
                        <div class="incoming-call-phone-icon"></div>
                    </div>
                    <div className="incoming-call__buttons">
                      <button className="incoming-call__button accept">
                        <FontAwesomeIcon onClick={() => this.answerCallHandler()} size="20x" icon={faPhone}/>
                      </button>
                      <button onClick={()=>closeHandler(false)} className="incoming-call__button reject">
                        <FontAwesomeIcon   icon={faPhoneSlash}/>
                      </button>
                    </div>
                </div>
              </div> :
              <div>
                  <Room roomName={room} closeHandler={closeHandler} token={token}/>
              </div>

        }
      </div>
    )
      }
    }
