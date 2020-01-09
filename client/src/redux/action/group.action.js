import {
    GET_GROUPS, 
    } from "../actionType/group.actionType";
import { removeError, addError } from "./errors.action";
import { restApi, userId } from "../../services/api";
import { socket } from "../../services/socketIo";
import axios from "axios";
import { startFetching } from "./fetch.actions";



export const setGroups = (groups) =>({
    type: GET_GROUPS,
    payload: groups

}) 



export const getAllGroups = () =>{
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

export const getGroupById = (groupId) =>{

    return dispatch =>{
        return new Promise((resolve, reject)=>{
        return restApi ("get", `/user/${userId}/group/${groupId}`)
        .then((response)=>{
            return resolve(response)   
            })
        .catch((error)=>{
            })
        })
    }
}


export const createGroup = (group) =>{
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