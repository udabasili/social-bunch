import {
    GET_GROUPS, GET_ROOM, 
    } from "../actionType/group.actionType";
import { removeError, addError } from "./errors.action";
import { restApi } from "../../services/api";
import { socket } from "../../services/socketIo";



let userId = sessionStorage.getItem("userId");

export const setGroups = (groups) =>({
    type: GET_GROUPS,
    payload: groups

}) 

export const setRoom = (roomInfo) =>({
    type: GET_ROOM,
    payload: roomInfo

}) 



export const getAllGroups = () => {
    return dispatch =>{
        return restApi ("get", "/groups")
            .then((response)=>{       
                dispatch(removeError())            
                dispatch(setGroups(response))
            })
            .catch((error)=>{   
               }
            )
    }
}

export const getGroupMembersById = (groupId) => {
    return dispatch =>{
        return new Promise((resolve, reject)=>{
        return restApi ("get", `/user/${userId}/group/${groupId}/`)
            .then((response)=>{
                dispatch(removeError())
                dispatch(setRoom(response))
                return resolve(response)   
            })
        .catch((error)=>{
            console.log(error)
            reject()
            })
        })
    }
}


export const createGroup = (group) =>{
    userId = sessionStorage.getItem("userId");
    return dispatch =>{
        return restApi ("post", `/user/${userId}/create-group/`, group)
            .then((response)=>{
                dispatch(removeError())            
                dispatch(setGroups(response))
            })
            .then(()=>{
                socket.emit('create', { userId, roomName: group.name }, (error) => {
                })
            })
            .catch((error)=>{
                dispatch(addError(error.message))
                }
            )
        }
}


export const joinGroup =  (groupId) => {
    return dispatch =>{
        return restApi ("get", `/user/${userId}/group/${groupId}/join`)
        .then((response)=>{
            dispatch(removeError())         
           return dispatch(setGroups(response))
        })               
        .catch((error)=>{
            dispatch(addError(error.message))
                }
            )
    
    }
}


export const leaveGroup =  (groupId) =>{
    return dispatch =>{
        return restApi ("get", `/user/${userId}/group/${groupId}/leave`)
            .then((response)=>{
                return dispatch(setGroups(response))
                })
            .catch((error)=>{
            }
        )
    }
}

export const deleteGroup =  (groupId) =>{
    return dispatch =>{        
        return restApi ("get", `/user/${userId}/group/${groupId}/delete`)
            .then((response)=>{
                dispatch(removeError())            
                    return dispatch(setGroups(response))
                })
                .catch((error)=>{
                    }
                )
    }
}