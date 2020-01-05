import React from 'react'

export default function UserIcon({imageUri}) {  
  return (
    <div className="user-icon">
      <div className="user-icon__photo-border">
        <img 
          src={imageUri}
          alt="your profile" 
          className="user-icon__photo"/>
      </div>
        <div className="user-icon__current-status"></div>
    </div>
  );
}

