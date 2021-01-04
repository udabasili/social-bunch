import React, { Component } from "react"; 
import React, { Component, createRef } from "react"; 
import { AiFillVideoCamera, AiFillPhone } from "react-icons/ai";
import { useHistory } from 'react-router-dom';
import { videoCallUser, acceptVideoCall, 
    iCECandidateEmittor,
    iCECandidateListener,
    finalVideoCallConnection, UnRegisterFinalVideoCallConnection } from '../services/socketIo';
const { RTCPeerConnection, RTCSessionDescription } = window;

const mediaConstraints = {
  audio: true, // We want an audio track
  video: true // ...and we want a video track
};
class VideoCall extends Component {
    
    constructor(props){
        super(props);
        // this.myPeerConnection = createRef();
        this.remoteVideo = createRef();
        this.localVideo = createRef()
        this.remoteStream = createRef()
        this.localStream = createRef()

        this.state ={
            callType: props.callType,
            localStream: null,
            myPeerConnection: null,
            localConnection:null,
			videoCallURequestObject: props.videoCallURequestObject,
            calling:props.calling,
            // local: props.
			caller:props.caller
        }
    }

    
    async componentDidMount(){
        await this.createPeerConnection()
         iCECandidateListener(async (msg) => {
        var candidate = new RTCIceCandidate(msg.candidate);
        console.log("*** Adding received ICE candidate: " + JSON.stringify(candidate));
                try {
                    await this.myPeerConnection.current.addIceCandidate(candidate)
                } catch(err) {
                    console.log(err);
                }
            })

        if(this.state.callType = 'calling'){
            // this.callUser()
        }else{
            this.handleVideoOfferMsg()
        }

         if(this.state.callType = 'calling'){
            this.startCall()
        }else{
            this.handleVideoOfferMsg()
        }
    }

    /**
     * This load when we begin calling a user
     */
    startCall= async () =>{
        // await  createPeerConnection();
        navigator.mediaDevices.getUserMedia(mediaConstraints)
            .then((localStream) => {
            document.getElementById("local-video").srcObject = localStream;
            //WE ATTACH OUR FIRST STREAM 
            localStream.getTracks().forEach(track => this.state.myPeerConnection.addTrack(track, localStream));
        })
    


    }

    //this would be use by both the callrer and callie to establish connection
     createPeerConnection =  () => {
		console.log("Setting up a connection...");
		let  myPeerConnection =  new RTCPeerConnection({
			iceServers: [     // Information about ICE servers - Use your own!
				{
					urls: "stun:stun2.1.google.com:19302"
				}
			]
        })
		myPeerConnection.onnegotiationneeded = this.handleNegotiationNeededEvent;
		myPeerConnection.onicecandidate = this.handleICECandidateEvent;
        myPeerConnection.ontrack = this.handleTrackEventHandler;
        this.setState({
            myPeerConnection
        })
        return myPeerConnection
    }

    /** Once we have established connection, we forward info to the other user that we are calling*/
    handleNegotiationNeededEvent = () =>  {
        let myUsername = this.state.caller.username
        let targetUsername = this.state.calling.username
        this.state.myPeerConnection.createOffer().then((offer) => {
            return this.state.myPeerConnection.setLocalDescription(offer);
        })
        .then(() =>{
             videoCallUser({
                name: myUsername,
                target: targetUsername,
                sdp: this.state.myPeerConnection.localDescription
        
            });
        })
        .catch(reportError);
    }

    //this loads when the user being called windows pops up
     handleVideoOfferMsg =(msg) => {
        var localStream = null;
        let targetUsername = msg.name;
        var desc = new RTCSessionDescription(msg.sdp);
        this.state.myPeerConnection.setRemoteDescription(desc).then( () =>{
        return navigator.mediaDevices.getUserMedia(mediaConstraints);
    })
    .then((stream)=> {
        localStream = stream;
        document.getElementById("local-video").srcObject = localStream;
        localStream.getTracks().forEach(track => this.state.myPeerConnection.addTrack(track, localStream));
    })
    .then(()=> {
        return this.myPeerConnection.current.createAnswer();
    })
    .then((answer) =>{
        return this.myPeerConnection.current.setLocalDescription(answer);
    })
    .then(()=> {
        var msg = {
        name: this.state.calling,
        target: targetUsername,
        sdp: this.myPeerConnection.current.localDescription
        };
        acceptVideoCall(msg, this.state.caller.socketId, this.state.calling.socketId)
        })
    }

    handleICECandidateEvent = (event) => {
         let targetUsername ;
        if(this.state.callType === 'calling'){
            targetUsername = this.state.caller.username

        }else{
            targetUsername = this.state.calling.username
        }

		if (event.candidate) {
			console.log("*** Outgoing ICE candidate: " + event.candidate);
			iCECandidateEmittor({
                target: targetUsername ,
                candidate: event.candidate
			});
		}
    }

    handleTrackEvent(event) {
        document.getElementById("received-video").srcObject = event.streams[0];
        document.getElementById("hangup-button").disabled = false;
    }




    render() {
        return (
            <div class="video-container">
                <video  autoPlay class="remote-video" id="remote-video"></video>
                <video  autoPlay muted class="local-video" id="local-video"></video>
                <div className='video-container__buttons'>
                    <div className='video-container__button reject'>
                        <AiFillPhone/>
                    </div>
                </div>
                <div className='video-container__time'>
                    <span>2:00</span>
                </div>
            </div>
        );
    }
}

export default VideoCall;