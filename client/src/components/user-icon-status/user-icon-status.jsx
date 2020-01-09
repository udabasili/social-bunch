import React, {useEffect, useState}from 'react'

export default function UserIcon({imageUri, username, onlineUsers}) {  
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
        <img 
          src={imageUri}
          alt="your profile" 
          className="user-icon__photo"/>
      </div>
        <div className={isOnline ?  "online" : "offline"}></div>
    </div>
  );
}

