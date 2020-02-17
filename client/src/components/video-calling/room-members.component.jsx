import React,{useState, useEffect, useRef} from 'react'

/**
  * @desc set the video and audio for the users within the room
  * friends list to User Icon as props
  * @param the members of the current room

*/

const RoomMembers = ({member}) => {

  const [videoTracks, setVideoTracks] = useState([]);
  const [audioTracks, setAudioTracks] = useState([]);

  const videoRef = useRef();
  const audioRef = useRef();

  useEffect(() => {
  
    setVideoTracks(Array.from(member.videoTracks.values()).filter(function (publication) {
      return publication.track;
  }).map(function (publication) {
      return publication.track;
  }))

    setAudioTracks(Array.from(member.audioTracks.values()).filter(function (publication) {
      return publication.track;
  }).map(function (publication) {
      return publication.track;
  }))

    const trackSubscribed = track => {
      if (track.kind === 'video') {
        setVideoTracks(videoTracks => [...videoTracks, track]);
      } else {
        setAudioTracks(audioTracks => [...audioTracks, track]);
      }
    };

    const trackUnsubscribed = track => {      
      if (track.kind === 'video') {
        setVideoTracks(videoTracks => videoTracks.filter(v => v !== track));
      } else {
        setAudioTracks(audioTracks => audioTracks.filter(a => a !== track));
      }
    };

    member.on('trackSubscribed', trackSubscribed);
    member.on('trackUnsubscribed', trackUnsubscribed);

    return () => {
      setVideoTracks([]);
      setAudioTracks([]);
      member.removeAllListeners();
    };
  }, [member]);

  useEffect(() => {
    const videoTrack = videoTracks[0];
    if (videoTrack) {
      videoTrack.attach(videoRef.current);
      return () => {
        console.log(4);

        videoTrack.detach();
      };
    }
  }, [videoTracks]);

  useEffect(() => {
    const audioTrack = audioTracks[0];
    if (audioTrack) {
      audioTrack.attach(audioRef.current);
      return () => {
        audioTrack.detach();
      };
    }
  }, [audioTracks]);

  return (
    <div className="video-component">
      <video ref={videoRef} autoPlay={true} />
      <audio ref={audioRef} autoPlay={true} muted={true}/>
    </div>
  );
};


export default RoomMembers