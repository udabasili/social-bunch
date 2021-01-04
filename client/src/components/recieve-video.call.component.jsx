import React, { Component , createRef} from "react"; 
import { AiFillVideoCamera, AiFillPhone } from "react-icons/ai";
import { videoCallUser, 
        iCECandidateEmittor, iCECandidateListener,
        acceptVideoCall, } from '../services/socketIo';
import VideoCall from "./video-call.component";
var myHostname = window.location.hostname;
if (!myHostname) {
  myHostname = "localhost";
}
const { RTCPeerConnection, RTCSessionDescription, RTCIceCandidate } = window;


class ReceiveVideoCall extends Component {
    
  render() {
    const {caller, currentUser, makeVideoCall, offer, receiverId} = this.props
    const {callAccepted} = this.state

    return (

     <React.Fragment>
         {
            callAccepted ?
            <div class="video-container">
                <video autoPlay class="remote-video" id="remote-video"></video>
                <video autoPlay muted class="local-video" id="local-video"></video>
                <div className='video-container__buttons'>
                    <div className='video-container__button reject' >
                        <AiFillPhone/>
                    </div>
                </div>
                <div className='video-container__time'>
                    <span>2:00</span>
                </div>
            </div> 
             :
             <div className='video-receiving'>
                <img className='video-calling__receiver' src={currentUser.userImage} alt='user-being-called'/>
                <div className='video-receiving__caller'>
                    <div className='video-receiving__avatar'>
                        <img  src={caller.userImage} alt='user-being-called'/>
                    </div>
                </div>
                <div className='video-calling__buttons'>
                    <div className='video-calling__button accept' onClick={() =>this.incomingCallHandler(true)}>
                            <AiFillVideoCamera/>
                    </div>
                    <div className='video-calling__button' onClick={() =>this.incomingCallHandler(false)}>
                        <AiFillPhone/>
                    </div>
                </div>
            </div>
         }
     </React.Fragment>
    );
  }
}

export default ReceiveVideoCall;