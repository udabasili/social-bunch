import React, { useEffect , useState} from 'react'
import { AiFillVideoCamera, AiFillPhone } from "react-icons/ai";
import { useHistory } from 'react-router-dom';
import { videoCallUser, acceptVideoCall, finalVideoCallConnection, UnRegisterFinalVideoCallConnection } from '../services/socketIo';

const { RTCPeerConnection, RTCSessionDescription } = window;
const peerConnection = new RTCPeerConnection();

export function Video({closeChat}) {


    const history = useHistory()
    useEffect(() => {
        navigator.getUserMedia({ video: true, audio: true },
        stream => {
            const localVideo = document.getElementById("local-video");
            if (localVideo) {
                localVideo.srcObject = stream;
            }

            stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));
            console.log(stream)
            peerConnection.ontrack = function({ streams: [stream] }) {
            const remoteVideo = document.getElementById("remote-video");
            if (remoteVideo) {
            remoteVideo.srcObject = stream;
        }
    };

        },
        error => {
            console.warn(error.message);
        }
    );
   
        return () => {
            
        };
    }, []);

    const goBack = () =>{
        closeChat()
    }
    
    return (
         <div class="video-container">
            <video autoPlay class="remote-video" id="remote-video"></video>
            <video autoPlay muted class="local-video" id="local-video"></video>
            <div className='video-container__buttons'>
                <div className='video-container__button reject' onClick={goBack}>
                    <AiFillPhone/>
                </div>
            </div>
            <div className='video-container__time'>
                <span>2:00</span>
            </div>
       </div>
    )
}


export function VideoCalling ({recipient, currentUser, makeVideoCall}) {
        const [acceptCall, setAcceptCall] = useState(false);
    useEffect(() => {
        callUser(recipient)
        finalVideoCallConnection(completeConnectionHandler)
        return () => {
            // UnRegisterFinalVideoCallConnection()
        }
    }, [])

   async function completeConnectionHandler ({ answer, socketId }){
       console.log(answer, socketId, "ff")
        await peerConnection.setRemoteDescription(
        new RTCSessionDescription(answer)
        );
        setAcceptCall(true)
        // if (!isAlreadyCalling) {
        // // callUser(data.socket);
        // isAlreadyCalling = true;
        // }
    }

    async function callUser(recipient) {
        // const caller = {
        //     image: currentUser.userImage,
        //     username : currentUser.username,
        //     _id: currentUser._id
        // }
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(new RTCSessionDescription(offer));
        videoCallUser(recipient.username, offer, currentUser.username)
        // socket.emit("call-user", { offer, to: socketId});
    }
    return (
        <React.Fragment>
            {
                acceptCall ? 
                <Video closeChat={() =>makeVideoCall(null, false)} /> :
        <div className='video-calling'>
            <img className='video-calling__receiver' src={recipient.image} alt='user-being-called'/>
            <div className='video-calling__sender'>
                <img className='video-calling__receiver' src={currentUser.userImage} alt='user-being-called'/>
            </div>
            <div className='video-calling__buttons'>
                <div className='video-calling__button reject'>
                    <AiFillPhone/>
                </div>
            </div>
        </div>}
        </React.Fragment>
    )
}

export function VideoReceiving ({caller, currentUser, makeVideoCall, offer, receiverId}) {
    
    const [acceptCall, setAcceptCall] = useState(false);
    const history = useHistory()

    const incomingCallHandler = async (acceptIncomingCall) =>{
        if(acceptIncomingCall){
            await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(new RTCSessionDescription(answer));
            acceptVideoCall(answer, caller.socketId, receiverId)
            setAcceptCall(true)
            return;
        }else{
            makeVideoCall(null, false)
        }
    }

    return (
        <React.Fragment>
            {
                acceptCall ?  
                    <Video closeChat={() =>makeVideoCall(null, false)} /> :
                     <div className='video-receiving'>
                        <img className='video-calling__receiver' src={currentUser.userImage} alt='user-being-called'/>
                        <div className='video-receiving__caller'>
                            <div className='video-receiving__avatar'>
                                <img  src={caller.userImage} alt='user-being-called'/>
                            </div>
                            <p className='video-receiving__username'>{caller.username}</p>
                        </div>
                        <div className='video-calling__buttons'>
                            <div className='video-calling__button accept' onClick={() =>incomingCallHandler(true)}>
                                    <AiFillVideoCamera/>
                            </div>
                            <div className='video-calling__button' onClick={() =>incomingCallHandler(false)}>
                                <AiFillPhone/>
                            </div>
                        </div>
                    </div>
            }
           
        </React.Fragment>
        
    )
}
