import { 
    CURRENT_USER,
    GET_USERS,
    GET_USERS_STATUS
    } from '../actionType/user.actionType'
import { restApi, TokenHeader } from '../../services/api';
import { addError, removeError} from './errors.action';
import { setGroups } from './group.action';
import { setEvents } from './event.action';
import { startFetching } from './fetch.actions';
import {disconnectSocket, getOnlineUsers, updateUserInfo } from '../../services/socketIo';
import axios from 'axios';


export const setAllUsers = (users) =>({
    type: GET_USERS,
    payload: users
}) 

export const setCurrentUser = (user) =>({
    type: CURRENT_USER,
    payload: user
}) 

export const setAllUsersStatus = (users, usersStatus) =>({
    type: GET_USERS_STATUS,
    payload: {
        users: users,
        usersStatus: usersStatus
    }
}) 

export const logOut = () =>{
    return dispatch =>{
        localStorage.clear()
        sessionStorage.clear()
        disconnectSocket()
        dispatch(setCurrentUser({}))
        setRestApiHeader(false)
        dispatch(setAllUsersStatus([],[]))
        dispatch(setGroups(null))
        dispatch(setEvents(null))
        getOnlineUsers()
    }
}

export const setRestApiHeader = (token) => {
    TokenHeader(token)
}


export const SignUp =  (fileHeader, fileData, jsonData) =>{
    const formData = new FormData();
    const userData =  JSON.stringify(jsonData);
    formData.append('file', fileData);
    formData.append('data', userData );
    return dispatch =>{
        return new Promise((resolve, reject)=>{
        return axios.post('/auth/register', formData, fileHeader)
            .then((res) =>{
                getOnlineUsers()        
                dispatch(removeError())
                let response = res.data.message
                let currentUser =  response.currentUser
                sessionStorage.setItem('userId', currentUser._id);
                sessionStorage.setItem('validator', response.validator)               
                setRestApiHeader(response.validator)
                dispatch(setCurrentUser(currentUser));    
                resolve(currentUser.username)
            })
            .catch((error) =>{
                console.log(error.response.data)
                dispatch(addError(error.response.data.message))
                reject()
            })
        })
    }

}



export function Login (type, userData){
    return dispatch =>{
        return new Promise((resolve, reject)=>{
            return restApi('post', `/auth/${type}`, userData)
                .then(response => {      
                    getOnlineUsers()                      
                    dispatch(removeError())
                    let currentUser =  response.currentUser
                    sessionStorage.setItem('userId', currentUser._id);
                    sessionStorage.setItem('validator', response.validator)
                    setRestApiHeader(response.validator)
                    dispatch(setCurrentUser(currentUser));
                    resolve(currentUser.username)
                })

                .catch((error)=>{                    
                    dispatch(addError(error.message))
                    return reject()
                })
        })
    }
}

export function editUser (userData){
    let userId = sessionStorage.getItem('userId');
    return dispatch =>{
        return new Promise((resolve, reject)=>{
            return restApi('post', `/user/${userId}/profile/edit`, userData)
                .then(response => {           
                    getOnlineUsers()        
                    dispatch(removeError())
                    let currentUser = response
                    dispatch(setCurrentUser(currentUser));
                    return resolve({'success':'Data Edited Successfully'})
                })
               
                .catch((error)=>{                    
                    return reject('Something went Wrong. Try Again Later')
                })
        })
    }
}

//Check if user is authenticated 
export function verifyUser () { 
    let token = sessionStorage.validator;
    setRestApiHeader(token)
    return dispatch =>{
        return new Promise((resolve, reject)=>{
            return restApi('get', '/authenticate-user')
            .then((response) =>{                            
                let currentUser = response.currentUser
                dispatch(setCurrentUser(currentUser));
                sessionStorage.setItem('validator', response.validator)
                sessionStorage.setItem('userId', currentUser._id)     
                setRestApiHeader(response.validator)
                dispatch(removeError())                
                return resolve()
            })
            .catch(()=>{
                localStorage.clear()
                sessionStorage.clear()
                disconnectSocket()
                dispatch(setCurrentUser({}))
                setRestApiHeader(false)
                dispatch(setAllUsersStatus([],[]))
                dispatch(setGroups(null))
                dispatch(setEvents(null))
                dispatch(addError('Please Login again'))
                return reject()
            })
        })
    }
}    


//Get all the users registered
export const getAllUsers = () =>{
    return dispatch =>{
        return restApi('get', '/api/users')
            .then((response)=>{                   
                dispatch(setAllUsers(response))
            })
            .catch((error)=>{
            })
    }
}


export const sendFriendRequest =  (addedUserId) =>{
    let userId = sessionStorage.getItem('userId');
    console.log(userId)
    return dispatch =>{
        return restApi('get', `/user/${userId}/send-friend-request/${addedUserId}`)
        .then((response)=>{                
            dispatch(removeError())            
                let currentUser = response.currentUser;
                let otherUser = response.otherUser;
                updateUserInfo(otherUser)
                dispatch(setCurrentUser(currentUser));
                dispatch(setAllUsers(currentUser))
                getOnlineUsers()        
            })
            .catch((error)=>{                
            })
    }
}

export const rejectFriendRequest =  (addedUserId) =>{
    let userId = sessionStorage.getItem('userId');
    return dispatch =>{
        return restApi('get', `/user/${userId}/reject-friend-request/${addedUserId}`)
            .then((response)=>{                
                dispatch(removeError())            
                let currentUser = response.currentUser
                let users = response.filteredUsers
                dispatch(setAllUsers(users))
                dispatch(setCurrentUser(currentUser))
                getOnlineUsers()        

            })
            .catch((error)=>{
            }
        )
    }
}

export const acceptFriendRequest =  (addedUserId) =>{   
    let userId = sessionStorage.getItem('userId'); 
    return dispatch =>{
        dispatch(startFetching());
        return restApi('get', `/user/${userId}/accept-friend-request/${addedUserId}`)
            .then((response)=>{                
                dispatch(removeError())            
                let currentUser = response.currentUser
                let users = response.filteredUsers
                dispatch(setAllUsers(users))
                dispatch(setCurrentUser(currentUser))
                getOnlineUsers()        

                })
            .catch((error)=>{
            })
    }
}



export const getLocation = (coords) =>{
    let userId = sessionStorage.getItem('userId');
    return dispatch =>{
    return new Promise((resolve, reject) =>{
        return restApi('post', `/user/${userId}/get-location`, coords)
            .then((result) => {                
                dispatch(removeError())
                resolve(result)
                return result
            }).catch((err) => {                
                reject()
            });
        })
    }
}