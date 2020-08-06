import React, {useEffect, useState} from 'react'
import {connect} from "react-redux";
import { LazyLoadImage } from "react-lazy-load-image-component";
import 'react-lazy-load-image-component/src/effects/blur.css';

function UserIcon({imageUri, username, onlineUsers}) {  
  const [isOnline, setIsOnline]  = useState("") 
  const [lastOnline, setLastOnline]  = useState("")  

  useEffect(() => {
    if (onlineUsers){
      let userIndex = onlineUsers.findIndex(friend =>(
          friend.username === username
    ))    
    if(userIndex !== -1){
      setIsOnline(onlineUsers[userIndex].isOnline)
      setLastOnline(onlineUsers[userIndex].isOnline)
      }
    }
    return () => {
    };
  }, [onlineUsers])


  return (
    <div className="user-icon">
      <div className="user-icon__photo-border">
        <LazyLoadImage alt={imageUri} effect="blur" src={imageUri} className='user-icon__photo' />
      </div>
      <div className={isOnline ? "online" : "offline"}></div>
    </div>
  );
}

const mapStateToProps = (state) =>({
   onlineUsers:state.user.usersStatus
})

export default connect(mapStateToProps, null)(UserIcon)