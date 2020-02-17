import React, { useState, useEffect } from 'react';
import Video from 'twilio-video';
import RoomMembers from './room-members.component';

/**
  * @desc create the room based on the room name and token from the server
  * @param token and name of room

*/

const Room = ({ roomName, token }) => {

    const [room, setRoom] = useState(null);
  const [participants, setParticipants] = useState([]);

  const remoteParticipants = participants.map(participant => (
    <RoomMembers key={participant.sid} member={participant}/>
  ));

  useEffect(() => {
    const participantConnected = participant => {
      setParticipants(prevParticipants => [...prevParticipants, participant]);
    };
    const participantDisconnected = participant => {
      setParticipants(prevParticipants =>
        prevParticipants.filter(p => p !== participant)
      );
    };
    Video.connect(token, {
      name: roomName,
    }).then(room => {
      setRoom(room);
      room.on('participantConnected', participantConnected);
      room.on('participantDisconnected', participantDisconnected);
      room.participants.forEach(participantConnected);
    });
    return () => {
        setRoom(currentRoom => {
          if (currentRoom && currentRoom.localParticipant.state === 'connected') {
            currentRoom.disconnect();
            currentRoom.localParticipant.tracks.forEach(publication => {
              publication.track.stop();
              const attachedElements = publication.track.detach();
              console.log("unsubscribed from: " + publication.track)
              attachedElements.forEach(element => element.remove());
          });
            return null;
          } else {

            return currentRoom;
          }
        });
      };
    }, [roomName, token]);
    return (
        <div className="room">
          <div className="current-user">
            {room ? (
              <RoomMembers key={room.localParticipant.sid}  member={room.localParticipant}/> 
            ) : (
              <div class="loader"></div>
            )}
          </div>
          <div className="recipient">{remoteParticipants}</div>
        </div>
      );
}

export default Room;