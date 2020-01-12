import { 
    CURRENT_USER,
    GET_USERS,
    } from "../actionType/user.actionType"
import { restApi, userId, convertBufferToImage, TokenHeader } from "../../services/api"
import { addError, removeError} from "./errors.action"
import { setGroups } from "./group.action"
import { setEvents } from "./event.action"
import { startFetching } from "./fetch.actions"
import { startIOConnection, socket } from "../../services/socketIo"
import axios from "axios";



export const setAllUsers = (users) =>({
    type: GET_USERS,
    payload: users
}) 

export const setCurrentUser = (user) =>({
    type: CURRENT_USER,
    payload: user
}) 


export const logOut = () =>{
    return dispatch =>{
        sessionStorage.clear()
        dispatch(setCurrentUser({}))
        setRestApiHeader(false)
        dispatch(setAllUsers([]))
        dispatch(setGroups(null))
        dispatch(setEvents(null))
       
    }
}

export const setRestApiHeader = (token) => {
    TokenHeader(token)
}


export const SignUp =  (fileHeader, fileData, jsonData) =>{
    const formData = new FormData() 
    const userData =  JSON.stringify(jsonData)
    formData.append('file', fileData)
    formData.append('data', userData )
    return dispatch =>{
        return new Promise((resolve, reject)=>{
        return axios.post("/auth/register", formData, fileHeader)
            .then((response) =>{
                dispatch(removeError())            
                resolve(response)
            })
            .catch((error) =>{
                dispatch(addError(error.response.data.error.message))
                reject()
            })
        })
    }

}



export function Login (type, userData){
    return dispatch =>{
        return new Promise((resolve, reject)=>{
            return restApi("post", `/auth/${type}`, userData)
                .then(response => {                    
                    dispatch(removeError())
                    sessionStorage.setItem("validator", response.validator)
                    setRestApiHeader(response.validator)
                    let currentUser = convertBufferToImage(response.currentUser);
                    sessionStorage.setItem("userId", currentUser._id);
                    dispatch(setCurrentUser(currentUser));
                    return currentUser.username
                })
                .then((response) =>{
                    //join the general room if user is authenticated
                    startIOConnection()
                    .then(() => {
                        socket.emit("onload", response, function(response){

                    })
                    //join socket based on group id and send user id to create group

                    })
                    resolve()
                })
                .catch((error)=>{                    
                    dispatch(addError(error.message))
                    return reject()
                })
        })
    }
}

export function editUser (userData){
    return dispatch =>{
        return new Promise((resolve, reject)=>{
            return restApi("post", `/user/${userId}/profile/edit`, userData)
                .then(response => {                    
                    dispatch(removeError())
                    let currentUser = convertBufferToImage(response);
                    dispatch(setCurrentUser(currentUser));
                    return resolve({"success":"Data Edited Successfully"})
                })
               
                .catch((error)=>{                    
                    return reject("Something went Wrong. Try Again Later")
                })
        })
    }
}

//Check if user is authenticated 
export const verifyUser = async () => { 
    let token = sessionStorage.validator;
    setRestApiHeader(token)
    return dispatch =>{
        return new Promise((resolve, reject)=>{
            return restApi("get", "/authenticate-user")
            .then((response) =>{            
                let currentUser = convertBufferToImage(response.currentUser)
                dispatch(setCurrentUser(currentUser));
                setRestApiHeader(token)
                sessionStorage.setItem("validator", response.validator)
                sessionStorage.setItem("userId", currentUser._id)            
                return resolve()
            })
            .catch((error)=>{
                setRestApiHeader(null)
                sessionStorage.removeItem("validator")
                sessionStorage.removeItem("userId")
                dispatch(addError("Please Login again"))
                return reject("")
            })
        })
    }
}    


//Get all the users registered
export const getAllUsers = () =>{
    return dispatch =>{
        return restApi("get", "/users")
            .then((response)=>{    
                dispatch(removeError())            
              let users =  response.map(use=>{
                   return convertBufferToImage(use)
               })
               
                dispatch(setAllUsers(users))
            })
            .catch((error)=>{
            })
    }
}

export const sendFriendRequest =  (addedUserId) =>{
    return dispatch =>{
        return restApi("get", `/user/${userId}/send-friend-request/${addedUserId}`)
        .then((response)=>{                
            dispatch(removeError())            
                let currentUser = response
                currentUser = convertBufferToImage(currentUser)
                dispatch(setCurrentUser(currentUser))

            })
            .catch((error)=>{                
                dispatch(addError("Something went Wrong. Try Again Later"))
            })
    }
}

export const rejectFriendRequest =  (addedUserId) =>{

    return dispatch =>{
        return restApi("get", `/user/${userId}/reject-friend-request/${addedUserId}`)
            .then((response)=>{                
                dispatch(removeError())            
                let currentUser = response.filteredUser
                currentUser = convertBufferToImage(currentUser)
                let users = response.filteredUsers
                users =  users.map(users=>{
                    return convertBufferToImage(users)
                })
                dispatch(setAllUsers(users))
                dispatch(setCurrentUser(currentUser))
                })
                .catch((error)=>{
                dispatch(addError("Something went Wrong. Try Again Later"))
            })
    }
}


export const acceptFriendRequest =  (addedUserId) =>{    
    return dispatch =>{
        dispatch(startFetching());
        return restApi("get", `/user/${userId}/accept-friend-request/${addedUserId}`)
            .then((response)=>{                
                dispatch(removeError())            
                let currentUser = response.filteredUser
                currentUser = convertBufferToImage(currentUser)
                let users = response.filteredUsers
                users =  users.map(users=>{
                    return convertBufferToImage(users)
                })
                dispatch(setAllUsers(users))
                dispatch(setCurrentUser(currentUser))
                })
                .catch((error)=>{
                dispatch(addError("Something went Wrong. Try Again Later"))
            })
    }
}



export const getLocation = (coords) =>{
    return dispatch =>{
    return new Promise((resolve, reject) =>{
        return restApi("post", `/user/${userId}/get-location`, coords)
            .then((result) => {                
                dispatch(removeError())
                resolve(result)
                return result
                
            }).catch((err) => {                
                dispatch(addError(err))
                reject()
            });
    })
    }
}