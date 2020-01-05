import  React from 'react'
import  UserIcon from "../user-icon-status/user-icon-status";
import {connect} from "react-redux";

function Contacts({currentUser, showProfile}) {  

  return (
      <div className="contact-container">
          {currentUser.friends ?
            <div className="user-contacts">
              {currentUser.friends.map((friend, i)=>(
                  <div 
                    key={i} 
                    className="user-contacts__item"
                     onClick={() => {
                       return showProfile({
                         friend:{
                           username:friend.userInfo.username,
                           image: `data:image/png;base64,${friend.userInfo.userImage}`
                          }
                        })
                        }
                       }>
                      <UserIcon imageUri={`data:image/png;base64,${friend.userInfo.userImage}`}/>
                      <div className="user-contacts__username">{friend.userInfo.username}</div>
                  </div>
              ))}
            </div>:
            <div className="user-contacts"> 
              NO FRIENDS YET     
            </div>}
      </div>
    
  )
}

const mapStateToProps = (state) =>({
   currentUser:state.user.currentUser
})

export default connect(mapStateToProps, null)(Contacts)