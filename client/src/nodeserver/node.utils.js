import io from 'socket.io-client';
import axios from "axios";
import {startFetching} from "../redux/action/fetch.actions";
import {setGroups} from "../redux/action/group.action";
import {setCurrentUser, setAllUsers } from "../redux/action/user.action";
import {setEvents} from "../redux/action/event.action";

export const socket =  io.connect("")

/**set the rest api header based on users authentication information */
const setHeader = () =>{
    const token = localStorage.getItem("validator")
    const userId = localStorage.getItem("userId")
    let header ={
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Authorization': `Bearer ${token}`
    }
    return [header, userId];
}

//set src value
const convertBufferToImage = (user) =>{
    let imageUrl = user.userImage
    imageUrl = "data:image/png;base64," + imageUrl;
    user.userImage = imageUrl
    return user
}




/************USER ***************/
//Check if user is authenticated 
export const verifyUser = async () => {
    let [header] = setHeader()
    return   axios.get("/authenticate-user",{headers:header})
        .then((response) =>{            
            let currentUser = response.data.user
            currentUser = convertBufferToImage(currentUser)
            localStorage.setItem("validator", response.data.token)
            localStorage.setItem("userId", currentUser._id)            
            return currentUser
        })
        .catch((error)=> {
            localStorage.removeItem("validator")
            localStorage.removeItem("userId")
            return error
        })
    }
    

//Get all the users registered
export const getAllUsers = () =>{
    let [header] = setHeader()
    return dispatch =>{
        dispatch(startFetching())
        axios.get("/users", {headers:header})
            .then((response)=>{                
              let users =  response.data.message.map(use=>{
                   return convertBufferToImage(use)
               })
               
                dispatch(setAllUsers(users))
            })
            .catch((error)=>console.log(error.response))
    }
}

//Login and join the general room if user is authenticated
export const Login = async (userData) =>{
    return axios.post("/auth/login", userData)
        .then((response)=>{            
            let currentUser = response.data.currentUser
            localStorage.setItem("validator", response.data.validator)
            localStorage.setItem("userId", currentUser._id)
            currentUser = convertBufferToImage(currentUser)  
            let username = currentUser.username
            startIOConnection()
                .then(() => {
                    //join socket based on group id and send user id to create group
                    socket.emit("onload", username, function(response){
                    })
                })
            return  currentUser
            })
        .catch((error)=>(error.response))
}



export const SignUp = async (fileHeader, fileData, jsonData) =>{
    const formData = new FormData() 
    const userData =  JSON.stringify(jsonData)
    formData.append('file', fileData)
    formData.append('data', userData )
    return axios.post("/auth/register", formData, fileHeader)
}

export const sendFriendRequest =  (addedUserId) =>{
    let [header,userId] = setHeader()
    return dispatch =>{
        dispatch(startFetching());
        return axios.get(`/user/${userId}/send-friend-request/${addedUserId}`, {headers:header})
        .then((response)=>{                
                let currentUser = response.data.message.filteredUser
                currentUser = convertBufferToImage(currentUser)
                let users = response.data.message.filteredUsers
                users =  users.map(users=>{
                    return convertBufferToImage(users)
                })
                dispatch(setCurrentUser(currentUser))
                dispatch(setAllUsers(users))

            })
            .catch((error)=>console.log(error.response))
    }
}

export const rejectFriendRequest =  (addedUserId) =>{
    let [header,userId] = setHeader()
    return dispatch =>{
        dispatch(startFetching());
        return axios.get(`/user/${userId}/reject-friend-request/${addedUserId}`, {headers:header})
            .then((response)=>{                
                let currentUser = response.data.message.filteredUser
                currentUser = convertBufferToImage(currentUser)
                let users = response.data.message.filteredUsers
                users =  users.map(users=>{
                    return convertBufferToImage(users)
                })
                dispatch(setAllUsers(users))
                dispatch(setCurrentUser(currentUser))
                })
            .catch((error)=>console.log(error.response))
    }
}


export const acceptFriendRequest =  (addedUserId) =>{
    let [header,userId] = setHeader()
    
    return dispatch =>{
        dispatch(startFetching());
        return axios.get(`/user/${userId}/accept-friend-request/${addedUserId}`, {headers:header})
            .then((response)=>{                
                let users =  response.data.message.map(users=>{
                    return convertBufferToImage(users)
                })
                
                    dispatch(setAllUsers(users))
                })
            .catch((error)=>console.log(error.response))
    }
}

//Events
export const getAllEvents = () =>{
    let [header] = setHeader()
    return dispatch =>{
        dispatch(startFetching())
        axios.get("/events", {headers:header})
            .then((response)=>{
                dispatch(setEvents(response.data.message))
            })
            .catch((error)=>console.log(error.response))
    }
}

export const createEvent = (event) =>{
    let [header,userId] = setHeader()
    return dispatch =>{
        dispatch(startFetching())
        axios.post(`/user/${userId}/create-event/`, event , {headers:header})
            .then((response)=>{                
                    dispatch(setEvents(response.data.message))
                })
                .catch((error)=>console.log(error.response))
        }
}

export const getEventById = async (eventId) =>{
    let [header,userId] = setHeader()
    return axios.get(`/user/${userId}/event/${eventId}`, {headers:header})
            .then((response)=>{
                return response.data.message
            })
            .catch((error)=> error.response)
    
    }


export const joinEvent = (eventId) =>{
    let [header,userId] = setHeader()
    
    return dispatch =>{
        dispatch(startFetching())        
        axios.get(`/user/${userId}/event/${eventId}/join`, {headers:header})
            .then((response)=>{
                dispatch(setEvents(response.data.message))
            })
            .catch((error)=>console.log(error.response))
    
    }
}

export const leaveEvent =  (eventId) =>{
    let [header,userId] = setHeader()
    return dispatch =>{
        dispatch(startFetching())
        axios.get(`/user/${userId}/event/${eventId}/leave`,{headers:header})
        .then((response)=>{
                dispatch(setEvents(response.data.message))
            })
            .catch((error)=>console.log(error.response))
    
    }
}

export const deleteEvent = (eventId) =>{
    let [header,userId] = setHeader()
    return dispatch =>{
        dispatch(startFetching())
        axios.get(`/user/${userId}/event/${eventId}/delete`,{headers:header})
            .then((response)=>{
                dispatch(setEvents(response.data.message))
            })
            .catch((error)=>console.log(error.response))
    }
}


//Groups
export const getAllGroups = () =>{
    let [header] = setHeader()    
    return dispatch =>{
        dispatch(startFetching())
        axios.get("/groups", {headers:header})
            .then((response)=>{                
                dispatch(setGroups(response.data.message))
            })
            .catch((error)=>console.log(error.response))
    }
}

export const getGroupById = async (groupId) =>{
    let [header,userId] = setHeader()
    return axios.get(`/user/${userId}/group/${groupId}`, {headers:header})
        .then((response)=>{
                return response.data.message
            })
        .catch((error)=> error.response)
    }


export const createGroup = (group) =>{
    let [header,userId] = setHeader()
    return dispatch =>{
        dispatch(startFetching())
        axios.post(`/user/${userId}/create-group/`, group , {headers:header})
            .then((response)=>{
                    dispatch(setGroups(response.data.message))
            })
            .then(()=>{
                socket.emit('create', { userId, roomName: group.name }, (error) => {
                    if (error) {
                        console.log(error)
                    }
                })
            })
            .catch((error)=>console.log(error.response))
        }
}

export const joinGroup =  (groupId) => {
    let [header,userId] = setHeader()
    return dispatch =>{
        dispatch(startFetching())
        axios.get(`/user/${userId}/group/${groupId}/join`, {headers:header})
        .then((response)=>{
            dispatch(setGroups(response.data.message))
        })               
        .catch((error)=>console.log(error.response))
    
    }
}

export const leaveGroup =  (groupId) =>{

    let [header,userId] = setHeader()
    return dispatch =>{
        dispatch(startFetching())
        axios.get(`/user/${userId}/group/${groupId}/leave`,{headers:header})
            .then((response)=>{
                dispatch(setGroups(response.data.message))
                })
                .catch((error)=>console.log(error.response))
    
    }
}

export const deleteGroup =  (groupId) =>{

    let [header,userId] = setHeader()

    return dispatch =>{
        dispatch(startFetching())
        axios.get(`/user/${userId}/group/${groupId}/delete`,{headers:header})
            .then((response)=>{
                    dispatch(setGroups(response.data.message))
                })
                .catch((error)=>console.log(error.response))
    
    }
}
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
    let [header,userId] = setHeader()
    
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
    console.log(message, sender, receiver);
      
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
    console.log(username);
    
    socket.emit("setRooms", username, (response) =>{
    })
}

export const sendMessage = (message, receiverId) =>{
    
    let [header,userId] = setHeader()
  

    return dispatch =>{
        dispatch(startFetching())
         axios.post(`/user/${userId}/send-message/${receiverId}`, {message}, {headers: header})
            .then((response)=>{                
                let currentUser = response.data.message.filteredUser
                currentUser = convertBufferToImage(currentUser)
                dispatch(setCurrentUser(currentUser))

            })
            .catch((error)=>console.log(error.response))
        }
}