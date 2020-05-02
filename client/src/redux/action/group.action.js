import {GET_GROUPS, GET_ROOM} from "../actionType/group.actionType";
import { removeError } from "./errors.action";
import { restApi } from "../../services/api";
import { socket } from "../../services/socketIo";

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
        return restApi ("get", "/api/groups")
            .then((response)=>{       
                dispatch(setGroups(response))
            })
            .catch((error)=>{   
               }
            )
    }
}

export const getGroupMembersById = (groupId) => {
    let userId = sessionStorage.getItem("userId");
    return dispatch =>{
        return new Promise((resolve, reject)=>{
        return restApi ("get", `/user/${userId}/group/${groupId}/`)
            .then((response)=>{
                dispatch(removeError())
                console.log(response)
                dispatch(setRoom(response))
                return resolve(response)   
            })
            .catch((error)=>{
                reject()
            })
        })
    }
}


export const createGroup = (group) =>{
    let userId = sessionStorage.getItem("userId");
    return dispatch =>{
        return restApi ("post", `/user/${userId}/create-group/`, group)
            .then((response)=>{
                dispatch(removeError())            
                dispatch(setGroups(response.groups))
                dispatch(joinGroup(response.groupId))
            })
            .then(()=>{
                socket.emit('create', {roomName: group.name }, (error) => {
                })
            })
            .catch((error)=>{
                }
            )
        }
}


export const joinGroup =  (groupId) => {
    let userId = sessionStorage.getItem("userId");
    return dispatch =>{
        return restApi ("get", `/user/${userId}/group/${groupId}/join`)
            .then((response)=>{
                dispatch(removeError())         
            return dispatch(setGroups(response))
            })               
            .catch((error)=>{
            }
        )
    
    }
}


export const leaveGroup =  (groupId) =>{
    let userId = sessionStorage.getItem("userId");
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
    let userId = sessionStorage.getItem("userId");
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