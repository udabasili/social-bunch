import { GET_EVENTS } from "../actionType/event.actionType";
import { removeError } from "./errors.action";
import { restApi } from "../../services/api";
import axios from "axios";
import { startFetching } from "./fetch.actions";
import { toast } from 'react-toastify';


export const setEvents = (events) =>({
    type: GET_EVENTS,
    payload: events

}) 

export const getAllEvents = () =>{
    return dispatch =>{
        return restApi ("get", "/api/events")
            .then((response)=>{
                dispatch(setEvents(response))
            })
            .catch((error)=>{
            }
        )
    }
}


export const createEvent = (event) =>{
    let userId = sessionStorage.getItem("userId");    
    return dispatch =>{
        return restApi ("post", `/user/${userId}/create-event/`, event)
            .then((response)=>{                   
                dispatch(removeError())    
                dispatch(joinEvent(response.eventId))        
                dispatch(setEvents(response.events))
                toast.success(`New event created`)
            })
            .catch((error)=>{
                toast.error(error.response.data.message)
            }
        )
    }
}


export const getEventById = async (eventId) =>{
    let userId = sessionStorage.getItem("userId");
    return axios.get(`/user/${userId}/event/${eventId}`)
        .then((response)=>{
            return response.data.message
        })
        .catch((error)=>{
        }
    )
}


export const joinEvent = (eventId) =>{    
    let userId = sessionStorage.getItem("userId");    
    return dispatch =>{
        dispatch(startFetching())        
        return restApi ("get", `/user/${userId}/event/${eventId}/join`)
            .then((response)=>{
                dispatch(removeError())            
                dispatch(setEvents(response))
                toast.success(`You have successfully joined event `)

            })
            .catch((error)=>{
                toast.error('Something went wrong. Try again later')

            }
        )
    
    }
}

export const leaveEvent =  (eventId) =>{
    let userId = sessionStorage.getItem("userId");
    return dispatch =>{
        dispatch(startFetching())
        return restApi ("get", `/user/${userId}/event/${eventId}/leave`)
        .then((response)=>{
            dispatch(removeError())            
            dispatch(setEvents(response))
            toast.success(`You have successfully left event `)

        })
        .catch((error)=>{
            toast.error('Something went wrong. Try again later')

        })
    
    }
}

export const deleteEvent = (eventId) =>{
    let userId = sessionStorage.getItem("userId");
    return dispatch =>{
        return restApi ("get",`/user/${userId}/event/${eventId}/delete`)
            .then((response)=>{
                dispatch(removeError())            
                dispatch(setEvents(response))
                toast.success(`You have successfully deleted event `)

            })
            .catch((error)=>{
                toast.error('Something went wrong. Try again later')

                }
            )
    }
}

