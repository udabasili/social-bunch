import io from 'socket.io-client';
import { userId } from './api';

export const socket =  io.connect("")

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
        console.log("message delivered")
    })
}

export const sendMessageToPerson =  (message, sender, receiver) =>{      
     return socket.emit("messageUser", {
        message,
        sender,
        receiver
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

