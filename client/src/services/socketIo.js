import io from 'socket.io-client';

export const socket =  io.connect("")
let userId = sessionStorage.getItem("userId");

/***CHAT */
/**start the connection based on the socket name */
export async function startIOConnection (){
  return socket.on("connection", (response) =>{
    const sessionID = socket.id
      return response;
  })
}

//send message to group
export const sendMessageToGroup = (message, groupId) =>{    
    return socket.emit("messageToGroup", {
        message: message,
        groupId: groupId,
        senderId: userId
        }, (error)=>{
        if(error){
            console.log(error);
            
        }
    })
}

export const sendMessageToPerson =  (message, sender, receiver, location) =>{      
     return socket.emit("messageUser", {
        message,
        sender,
        receiver,
        location
        }, (response)=>{
            
        return response
    })
    
}

//recieve message
//send message to group
export const setRooms = (username) =>{    
    socket.emit("setRooms", username, (response) =>{
    })
}

