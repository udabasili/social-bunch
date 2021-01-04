import React, { Component, createRef } from "react"; 
import {  videoCallUser, iCECandidateEmittor, iCECandidateListener } from "../services/socketIo";
import { AiFillVideoCamera, AiFillPhone } from "react-icons/ai";
var myHostname = window.location.hostname;
if (!myHostname) {
  myHostname = "localhost";
}


const { RTCPeerConnection, RTCIceCandidate } = window;

class SendVideoCall extends Component {
	
	constructor(props){
		super(props);
		this.ourVideo= createRef()
		this.recipientVideo= createRef()
		this.peerRef = createRef()
		this.state ={
			callAccepted: false,
			receivingCall: false,
			makingCall: false,
			recipient: props.recipient,
			currentUser: props.currentUser,
			streams: [],
			

		}
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
		//start the call process 		
		myPeerConnection.onnegotiationneeded = this.handleNegotiationNeededEvent;
		myPeerConnection.onicecandidate = this.handleICECandidateEvent;
		myPeerConnection.ontrack = this.handleTrackEventHandler;
		this.peerRef.current = myPeerConnection
	}

	 handleICECandidateEvent = (event) => {
		if (event.candidate) {
			console.log(this.myPeerConnection.current.iceConnectionState)
			console.log("*** Outgoing ICE candidate: " + event.candidate.candidate);
			iCECandidateEmittor({
			type: "new-ice-candidate",
			target: this.state.recipient.username,
			candidate: event.candidate
			});
		}
	}

	handleTrackEventHandler = (event) => {
		
		console.log(event)
		document.getElementById("remote-video").srcObject = event.streams[0];
		// document.getElementById("hangup-button").disabled = false;
	}

	

	startCall = () =>{
		if (this.peerRef.current) {
			alert("You can't start a call because you already have one open!");
		} 
		this.createPeerConnection()
		navigator.mediaDevices.getUserMedia({ video: true, audio: true })
			.then((localStream) => {
				this.ourVideo.current.srcObject = localStream;
				localStream.getTracks().forEach(track => this.peerRef.current.addTrack(track, localStream));
			})
			.catch((error) =>{
				console.log(error)
			})
	}
	componentDidMount(){
		this.startCall()
		iCECandidateListener(({candidate}) => {
			  var candidate = new RTCIceCandidate(candidate);
				this.peerRef.current.addIceCandidate(candidate)
		})
		// 	navigator.getUserMedia({ video: true, audio: true }, stream => {
		// 		this.ourVideo.current.srcObject = stream;
		// 		this.ourVideo.current = stream

		// 		this.peerRef.current.ontrack = function({ stream }) {
		// 			console.log(stream)
		// 			// const remoteVideo = document.getElementById("remote-video");
		// 			if (remoteVideo) {
		// 			remoteVideo.srcObject = stream;
		// 			}
		// 		}

		// 	stream.getTracks().forEach(track => this.peerRef.current.addTrack(track, stream));
		// 	console.log(stream.getTracks())

        //     },
        //     error => {
        //     console.warn(error.message);
        //     }
		// );
	
		// this.init()
		// const {recipient, currentUser, makeVideoCall} = this.props;
		// //when the other has accepted the call
		// this.callUser(recipient.username)
		
		
	}

	// init = () =>{
		
	// 	const {recipient, currentUser, makeVideoCall} = this.props;
	// 	navigator.getUserMedia({ video: true, audio: true },
    //         stream => {
	// 			const localVideo = document.getElementById("local-video");
	// 			this.peerRef.current.ontrack = function({ stream }) {
	// 				console.log(stream)
	// 				const remoteVideo = document.getElementById("remote-video");
	// 				if (remoteVideo) {
	// 				remoteVideo.srcObject = stream;
	// 				}
	// 			}
    //         if (localVideo) {
    //             localVideo.srcObject = stream;
    //             }
	// 		stream.getTracks().forEach(track => this.peerRef.current.addTrack(track, stream));
	// 		console.log(stream.getTracks())

    //         },
    //         error => {
    //         console.warn(error.message);
    //         }
	// 	);
	
		

	// }

	completeConnectionHandler = async ({ answer, socketId }) => {
		await this.peerRef.current.setRemoteDescription(answer);
		// this.ourVideo.current.getTracks().forEach(track => this.peerRef.current.addTrack(track, stream));
		
		this.setState({
			callAccepted: true
		})
		this.init()
		

    }

	handleNegotiationNeededEvent = async () => {
		const {recipient, currentUser, makeVideoCall} = this.props
        const offer = await this.peerRef.current.createOffer();
		await this.peerRef.current.setLocalDescription(offer);
		let sdp =  this.peerRef.current.localDescription
		let type = "video-offer"
        videoCallUser(recipient.username,  type, currentUser.username, sdp)
	}
	

	render() {
		const {recipient, currentUser, makeVideoCall} = this.props;
		const {callAccepted} = this.state
		return (
		 	<React.Fragment> 
				 <div className="video-container">
						 {callAccepted ?
						 	<React.Fragment>
								<video ref={this.recipientVideo} autoPlay className="remote-video" id="remote-video"></video> 
								<div className='video-container__buttons'>
									<div className='video-container__button reject'>
										<AiFillPhone/>
									</div>
								</div>
								<div className='video-container__time'>
									<span>2:00</span>
								</div>
							 </React.Fragment> :
							<div className='video-calling'>
								<img className='video-calling__receiver' src={recipient.image} alt='user-being-called'/>
								<div className='video-calling__buttons'>
									<div className='video-calling__button reject' onClick={() => makeVideoCall(null, false)}>
										<AiFillPhone/>
									</div>
								</div>
							</div>
							 

						 }
						<video ref={this.ourVideo} autoPlay muted className="local-video" id="local-video"></video>
						
				</div>
				 {/* {
					 callAccepted ?
					 <div></div> :
					 <div className='video-calling'>
						<img className='video-calling__receiver' src={recipient.image} alt='user-being-called'/>
						<div className='video-calling__sender'>
							<img className='video-calling__receiver' src={currentUser.userImage} alt='user-being-called'/>
						</div>
						<div className='video-calling__buttons'>
							<div className='video-calling__button reject' onClick={() => makeVideoCall(null, false)}>
								<AiFillPhone/>
							</div>
						</div>
					</div>

				 } */}
				 
		 </React.Fragment>
		);
	}
}

export default SendVideoCall;