import openSocket from 'socket.io-client';
export const socket = openSocket(window.location.origin)

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

export const setSocket = (username) => {
    socket.emit("login", {username})
}

export const sendPrivateMessage = (message, sender, receiver, location, chatId) =>{    
    console.log(sender, receiver)  
    return socket.emit("messageUser", {
       message,
       sender,
       receiver,
       location,
        chatId
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

export const getAllUsers = () => {
    socket.emit("allUsers");
}

export const setAllUsersListener = (allUsersHandler) => {
    socket.on("setAllUsers", allUsersHandler);
}

export const newUserAlert = (newUserHandler) => {
    socket.emit("newUser", newUserHandler);
}

export const newUserListener = (newUserHandler) => {
    socket.on("newUserAdded", newUserHandler);
}
export const UnRegisternewUserListener = () => {
    socket.off("newUserAdded");
}

export const UnRegistersetAllUsersListener = (allUsersHandler) => {
    socket.off("setAllUsers");
}

export const unRegisterSetOnlineUsers = () => {
    socket.off("onlineUsers");
}

export const UnRegisterChangeOnlineUsers = () => {
    socket.off("changeOnlineUsers");
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

export const changePostListener = (changePostListenerFunction) =>{
    socket.on("posts", changePostListenerFunction);
}

export const UnregisterChangePostListener = () =>{
    socket.off("posts");
}

export const currentUserUpdateListener = (currentUserUpdateListenerFunction) =>{
    socket.on("currentUser", currentUserUpdateListenerFunction);
}

export const UnregisterCurrentUserUpdateListener = () =>{
    socket.off("currentUser");
}

/** 
 * VIDEO CALL
*/
export  function videoCallUser({name, target, sdp}) {
    socket.emit("video-offer-1", {
    name,
    target,
    sdp
    })
}

export function receiveVideoCallRequest(receiveVideoCallRequestHandler){
    socket.on("video-offer-2", receiveVideoCallRequestHandler)
}

export function UnRegisterReceiveVideoCallRequest(){
    socket.off("video-offer" )
}

export function acceptVideoCall(msg, callerSocketId, receiverId){
    socket.emit("video-answer-1", { msg, callerSocketId, receiverId })
}

export function iCECandidateEmittor({target, candidate}){
    socket.emit("ice-candidate", { target, candidate })
}


export function iCECandidateListener(iCECandidateListenerHandler){
    socket.on("ice-candidate-listener", iCECandidateListenerHandler)
}

// export function UnRegisterAcceptVideoCall(){
//     socket.off("video-answer" )
// }


