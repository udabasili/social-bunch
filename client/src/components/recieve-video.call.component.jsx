import React, { Component , createRef} from "react"; 
import { AiFillVideoCamera, AiFillPhone } from "react-icons/ai";
import { useHistory } from 'react-router-dom';
import { videoCallUser, 
        iCECandidateEmittor, iCECandidateListener,
        acceptVideoCall, finalVideoCallConnection, UnRegisterFinalVideoCallConnection } from '../services/socketIo';
import VideoCall from "./video-call.component";
var myHostname = window.location.hostname;
if (!myHostname) {
  myHostname = "localhost";
}
const { RTCPeerConnection, RTCSessionDescription, RTCIceCandidate } = window;


class ReceiveVideoCall extends Component {

    constructor(props){
        super(props);
        this.peerRef = createRef()
        this.state={
            callAccepted: false,
            caller: props.caller,
            recipient: props.recipient,
            videoCallURequestObject: props.videoCallURequestObject,
            currentUser: props.currentUser
        }
    }

    componentDidMount(){
        iCECandidateListener(({candidate}) => {
              var candidate = new RTCIceCandidate(candidate);
              console.log(candidate)
				this.peerRef.current.addIceCandidate(candidate)
		})
    }
    createPeerConnection =  () => {
       console.log("Setting up a connection...");
		let  myPeerConnection =  new RTCPeerConnection({
			iceServers: [     // Information about ICE servers - Use your own!
				{
					urls: "turn:" + myHostname,  // A TURN server
					username: "webrtc",
					credential: "turnserver"
				}
			]
		});
		myPeerConnection.onnegotiationneeded = this.handleNegotiationNeededEvent;
		myPeerConnection.onicecandidate = this.handleICECandidateEvent;
		myPeerConnection.ontrack = this.handleTrackEvent;
		this.peerRef.current = myPeerConnection
	}

    handleTrackEvent = (event) => {
		this.setState({
			callAccepted: true
        })
        console.log(event)
		// document.getElementById("remote-video").srcObject = event.streams[0];
		// document.getElementById("hangup-button").disabled = false;
    }

    handleNegotiationNeededEvent = async () => {
		const {recipient, currentUser, makeVideoCall} = this.props
        const offer = await this.peerRef.current.createOffer();
		await this.peerRef.current.setLocalDescription(offer);
		let sdp =  this.peerRef.current.localDescription
		let type = "video-offer"
        videoCallUser(recipient.username,  type, currentUser.username, sdp)
	}
    
     handleICECandidateEvent = (event)  =>{
		if (event.candidate) {
			console.log("*** Outgoing ICE candidate: " + event.candidate.candidate);
			iCECandidateEmittor({
			type: "new-ice-candidate",
			target: this.state.caller.username,
			candidate: event.candidate
			});
		}
	}
    
    incomingCallHandler = async (acceptIncomingCall) => {
        
        const {caller, currentUser, makeVideoCall, videoCallURequestObject, receiverId} = this.props
        if(acceptIncomingCall){
            this.createPeerConnection();
            this.setState({
                callAccepted: true
            })
            var desc = new RTCSessionDescription(videoCallURequestObject.sdp);
            await this.peerRef.current.setRemoteDescription(desc)
            let localStream =  await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            const localVideo = document.getElementById("local-video");
             if (localVideo) {
                localVideo.srcObject = localStream;
            }
            localStream.getTracks().forEach(track => this.peerRef.current.addTrack(track, localStream));
            const answer = await this.peerRef.current.createAnswer();
            await this.peerRef.current.setLocalDescription(answer);
            let type ="video-answer"
            let sdp = this.peerRef.current.localDescription
            let response = {
                type, 
                sdp
            }
            acceptVideoCall(response, caller.socketId, receiverId)
            
            return;
        }else{
            makeVideoCall(null, false)
        }
    }

    completeConnectionHandler = async ({ answer, socketId }) =>{
        await this.peerRef.current.setRemoteDescription(
        new RTCSessionDescription(answer)
        );
        this.setState({
            callAccepted: true
        })
        
    }
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