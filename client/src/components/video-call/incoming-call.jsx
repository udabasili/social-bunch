import React, { Component, useRef } from 'react';
import Video from 'twilio-video';
import axios from 'axios';
import ReceiveCall from "./recieve-call";
import {connect} from "twilio-video"
class VideoComponent extends Component {
 constructor(props) {
    super(props)
    this.state = {
        token:null,
        participants:[],
        room: props.room,
        identity: props.calling, 
        caller: props.caller, 
        incomingCalling: props.incomingCalling,
        previewTracks: null,
        localMediaAvailable: false, 
        hasJoinedRoom: false,
        activeRoom: null 
      }
 }
  
    

    componentDidMount(){
        let body ={ 
            room: this.state.room,
            identity: this.state.identity
            }

        axios.post('/video-token', body).then(results => {
            let token = results.data.message.token
            this.setState({token: token, });
                })

        }

        
        acceptCall = (value) => {
            this.setState({
                incomingCalling: false
            })
        //     let connectOptions = { name: this.state.room};
        //     if (this.state.previewTracks) {
        //         connectOptions.tracks = this.state.previewTracks;
        // }
        connect(this.state.token, { name: this.state.room}).then(room => {
          console.log(`Successfully joined a Room: ${room}`);
          room.on('participantConnected', participant => {
            console.log(`A remote Participant connected: ${participant}`);
          });
        }, error => {
          console.error(`Unable to connect to Room: ${error.message}`);
        });
        // Video.connect(this.state.token).then(this.roomJoined, error => {
        //     alert('Could not connect to Twilio: ' + error.message);
            
        //   });
        }

        leaveRoom = () =>{
            this.state.activeRoom.disconnect();
            this.props.closeHandler(false)
            this.setState({ hasJoinedRoom: false, localMediaAvailable: false });
        }
/**Get the audio and video from user and attach to div container with ref */
    attachTrack(track, container) {
        container.appendChild(track.attach());
        }
    
    attachParticipantTracks(participant, container) {
        var tracks = this.getTracks(participant)
        this.attachTracks(tracks, container);
    }

//get the track from from the participant map
    getTracks(participant) {
    return Array.from(participant.tracks.values()).filter(function (publication) {
        return publication.track;
    }).map(function (publication) {
        return publication.track;
    });
    }
//attach the tracks to the container
    attachTracks(tracks, container) {
        tracks.forEach((track)=> {
            this.attachTrack(track, container);
          });
        }

    
    roomJoined = (room) =>{

        console.log(`Successfully joined a Room: ${room}`);
        room.on('participantConnected', participant => {
          console.log(`A remote Participant connected: ${participant}`);
        })
    
}
      
    

      // Attach LocalParticipant's tracks to the DOM, if not already attached.
    handleLogout = () => {
      this.setState({
        token: null
      })
    }
  
 render() {
   const {token} = this.state
   let showLocalTrack = <div className="flex-item"><div ref="localMedia" /> </div>  
      console.log(this.state.incomingCalling );
      
   return (
    <div className="app">
      <header>
        <h1>Video Chat with Hooks</h1>
      </header>
      <main>
      { token &&
          this.state.incomingCalling ? 
              <div>
                <ReceiveCall/>
                <button label="Leave Room" onClick={() => this.acceptCall(true)}  >Accept</button>
              </div>
          :   <div>
                {showLocalTrack}
                <button label="Leave Room" onClick={() => this.leaveRoom()}  >Leave</button>

              </div>

      }
      </main>
    </div>

       
   )
   }
}


  
export default VideoComponent