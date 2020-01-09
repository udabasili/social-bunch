import React,{useState, useEffect, useRef} from 'react';
import Video from 'twilio-video';
import Screen from "./screen";


const VideoChat = ({token, roomName,handleLogout}) => {
  const [room, setRoom] = useState(null);// set the room
  const [participants, setParticipants] = useState([]);// set the members of the room
  

  useEffect(() => {
    const participantConnected = participant => {
      return setParticipants(prevParticipants => [...prevParticipants, participant]);
    };
    const participantDisconnected = participant => {
     return setParticipants(prevParticipants =>
        prevParticipants.filter(p => p !== participant)
      );
    };
    //connect to room and set the local participants 
    //also set the connect nad disconnect
    Video.connect(token, {
      name: roomName
    }).then(room => {
      setRoom(room);
      room.on('participantConnected', participantConnected);
      room.on('participantDisconnected', participantDisconnected);
      room.participants.forEach(participantConnected);
      
    }).catch((error)=>console.log()
    )
    
    //disconnect when it is unmounted 
    return () => {
      setRoom(currentRoom => {
        if (currentRoom && currentRoom.localParticipant.state === 'connected') {
          currentRoom.disconnect();
          return null;
        } else {
          return currentRoom;
        }
      });
    };
  }, [roomName]);

  const remoteParticipants = participants.map(participant => (
    <Screen key={participant.sid} participant={participant} />

  ));
  
 return (
   <div>
        <button onClick={handleLogout}>Log out</button>
        Room:{roomName}
        {room && (
          <Screen key={room.localParticipant.sid} participant={room.localParticipant} />
            )}
            <h3>Remote Participants</h3>
          <div >{remoteParticipants}</div>
      </div>
   
 )
     }
export default VideoChat;