import { GET_GROUPS } from "./group.actionType";
import axios from "axios";
import { toast } from 'react-toastify';


export const setGroups = (groups) =>({
    type: GET_GROUPS,
    payload: groups

}) 

export const getAllGroups = () =>{
    return dispatch =>{
        return axios({
            method: 'GET',
            url: "/api/public/groups",
            withCredentials: true
        })
        .then((response)=>{
            dispatch(setGroups(response.data.message))
        })
        .catch((error)=>{
            toast.error(error.response.data.message)
            throw error.response.data.message
        })
    }
}


export const createGroup = (group) => (dispatch, getState) => {
    const { user } = getState();
    const userId = user.currentUser._id   
        return axios({
            method: 'POST',
            data: group,
            url: `/api/user/${userId}/create-group/`,
            withCredentials: true
        })
        .then((response)=>{                   
            dispatch(setGroups(response.data.message))
            toast.success(`New group created`)
        })
        .catch((error)=>{
            toast.error(error.response.data.message)
            throw error.response.data.message
        }
    )
}

export const getGroupById = (groupId) => (dispatch, getState) => {
    const { user } = getState();
    const userId = user.currentUser._id   
        return axios({
            method: 'GET',
            url: `/api/user/${userId}/group/${groupId}`,
            withCredentials: true
        })
        .then((response)=>{                   
            dispatch(setGroups(response.data.message))
        })
        .catch((error)=>{
            toast.error(error.response.data.message)
        }
    )
}

export const joinGroup = (groupId) => (dispatch, getState) => {
    const { user } = getState();
    const userId = user.currentUser._id   
        return axios({
            method: 'GET',
            url: `/api/user/${userId}/group/${groupId}/join`,
            withCredentials: true
        })
        .then((response)=>{                   
            dispatch(setGroups(response.data.message))
            toast.success(`You have successfully joined group `)
        })
        .catch((error)=>{
            toast.error(error.response.data.message)
        }
    )
}

export const leaveGroup = (groupId) => (dispatch, getState) => {
    const { user } = getState();
    const userId = user.currentUser._id   
        return axios({
            method: 'GET',
            url: `/api/user/${userId}/group/${groupId}/leave`,
            withCredentials: true
        })
        .then((response)=>{                   
            dispatch(setGroups(response.data.message))
            toast.success(`You have successfully left group `)

        })
        .catch((error)=>{
            toast.error(error.response.data.message)
        }
    )
}

export const deleteGroup = (groupId) => (dispatch, getState) => {
    const { user } = getState();
    const userId = user.currentUser._id   
        return axios({
            method: 'DELETE',
            url: `/api/user/${userId}/group/${groupId}/delete`,
            withCredentials: true
        })
        .then((response)=>{                   
            dispatch(setGroups(response.data.message))
            toast.success(`You have successfully deleted group `)

        })
        .catch((error)=>{
            toast.error(error.response.data.message)
        }
    )
}
