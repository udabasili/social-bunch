import { GET_EVENTS } from "./event.actionType";
import axios from "axios";
import { toast } from 'react-toastify';


export const setEvents = (events) =>({
    type: GET_EVENTS,
    payload: events

}) 

export const getAllEvents = () =>{
    return dispatch =>{
        return axios({
            method: 'GET',
            url: "/api/public/events",
            withCredentials: true
        })
        .then((response)=>{
            dispatch(setEvents(response.data.message))
        })
        .catch((error)=>{
            toast.error(error.response.data.message)
            throw error.response.data.message
        })
    }
}


export const createEvent = (event) => (dispatch, getState) => {
    const { user } = getState();
    const userId = user.currentUser._id   
        return axios({
            method: 'POST',
            data: event,
            url: `/api/user/${userId}/create-event/`,
            withCredentials: true
        })
        .then((response)=>{                   
            dispatch(setEvents(response.data.message))
            toast.success(`New event created`)
        })
        .catch((error)=>{
            toast.error(error.response.data.message)
            throw error.response.data.message
        }
    )
}

export const getEventById = (eventId) => (dispatch, getState) => {
    const { user } = getState();
    const userId = user.currentUser._id   
        return axios({
            method: 'GET',
            url: `/api/user/${userId}/event/${eventId}`,
            withCredentials: true
        })
        .then((response)=>{                   
            dispatch(setEvents(response.data.message))
        })
        .catch((error)=>{
            toast.error(error.response.data.message)
        }
    )
}

export const joinEvent = (eventId) => (dispatch, getState) => {
    const { user } = getState();
    const userId = user.currentUser._id   
        return axios({
            method: 'GET',
            url: `/api/user/${userId}/event/${eventId}/join`,
            withCredentials: true
        })
        .then((response)=>{                   
            dispatch(setEvents(response.data.message))
            toast.success(`You have successfully joined event `)
        })
        .catch((error)=>{
            toast.error(error.response.data.message)
        }
    )
}

export const leaveEvent = (eventId) => (dispatch, getState) => {
    const { user } = getState();
    const userId = user.currentUser._id   
        return axios({
            method: 'GET',
            url: `/api/user/${userId}/event/${eventId}/leave`,
            withCredentials: true
        })
        .then((response)=>{                   
            dispatch(setEvents(response.data.message))
            toast.success(`You have successfully left event `)

        })
        .catch((error)=>{
            toast.error(error.response.data.message)
        }
    )
}

export const deleteEvent = (eventId) => (dispatch, getState) => {
    const { user } = getState();
    const userId = user.currentUser._id   
        return axios({
            method: 'DELETE',
            url: `/api/user/${userId}/event/${eventId}/delete`,
            withCredentials: true
        })
        .then((response)=>{                   
            dispatch(setEvents(response.data.message))
            toast.success(`You have successfully deleted event `)

        })
        .catch((error)=>{
            toast.error(error.response.data.message)
        }
    )
}
