const io = require('socket.io-client')
export const socket = io.connect('')

/**CHAT**/
//start the connection
export  function startIOConnection (){
    socket.connect();
}

/**ROOMS */

export const setRooms = () =>{
    socket.emit("setRooms");
}

export const receiveMessageForGroup = (setGroupMessageHandler) =>{
    socket.on('groupMessage', setGroupMessageHandler)
}

export const unRegisterReceiveMessageForGroup = () =>{ 
    socket.off('groupMessage')
}

export const updateRoomMembersStatus = (setGroupMembersStatus) =>{ 
    socket.on('updateRoomMemberStatus', setGroupMembersStatus)
}

export const unRegisterUpdateRoomMembersStatus = () =>{ 
    socket.off('updateRoomMemberStatus')
}

export const updateUserInfo = (userData) => {
    socket.emit("updateUserData", {userData})
}

export const setUserInfo = (setUserDataHandler) => {
    socket.on("setUserData", setUserDataHandler)
}

export const UnRegisterSetUserInfo = () => {
    socket.off("setUserData")
}

export const enterRoom = (username,roomId) => {
    socket.emit("enter", {username, roomId})
}

export const exitRoom = (username,roomId) => {
    socket.emit("exit", {username, roomId})
}
 
export const disconnectSocket = () => {
    socket.close()
}

/**PRIVATE MESSAGES **/

export const connectOnAuth = (username) => {
    socket.emit("login", {username:username})
}

export const sendPrivateMessage =  (message, sender, receiver, location) =>{      
    return socket.emit("messageUser", {
       message,
       sender,
       receiver,
       location
       }, (response)=>{
           
       return response
   })
}

export const receivePrivateMessage = (receiveMessageHandler) => {
    socket.on('privateMessage', receiveMessageHandler)    
}

export const unRegisterReceivePrivateMessage =() =>{      
    socket.off('receiveVideoCall')
}

/**GROUP MESSAGING**/
export const changeOnlineUsers = (changeOnlineUsersHandler) => {
    socket.on("changeOnlineUsers", changeOnlineUsersHandler);
}

export const setOnlineUsers = (onlineUsersHandler) => {
    socket.on("onlineUsers", onlineUsersHandler);
}

export const getOnlineUsers = () => {
    socket.emit("getOnlineUsers");
}

export const unRegisterSetOnlineUsers = () => {
    socket.off("onlineUsers");
}

export const sendMessageToGroup = (message, groupId) =>{    
    let userId = sessionStorage.getItem("userId");
    return socket.emit("messageToGroup", {
        message: message,
        groupId: groupId,
        senderId: userId
        }, (error)=>{
        if(error){            
        }
    })
}

