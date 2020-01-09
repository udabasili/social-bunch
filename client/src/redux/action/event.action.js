import { GET_EVENTS } from "../actionType/event.actionType";
import { removeError, addError } from "./errors.action";
import { restApi, userId } from "../../services/api";
import { socket } from "../../services/socketIo";
import axios from "axios";
import { startFetching } from "./fetch.actions";

export const setEvents = (events) =>({
    type: GET_EVENTS,
    payload: events

}) 

export const getAllEvents = () =>{

    return dispatch =>{
        return restApi ("get", "/events")
            .then((response)=>{
                dispatch(removeError())            
                dispatch(setEvents(response))
            })
            .catch((error)=>{
                }
            )
    }
}


export const createEvent = (event) =>{
    return dispatch =>{
        return restApi ("post", `/user/${userId}/create-event/`, event)
            .then((response)=>{                
                dispatch(removeError())            
                    dispatch(setEvents(response))
                })
                .catch((error)=>{


        })
    }
}


export const getEventById = async (eventId) =>{
    return axios.get(`/user/${userId}/event/${eventId}`)
            .then((response)=>{
                return response.data.message
            })
            .catch((error)=>{

            }

        )
    
    }


export const joinEvent = (eventId) =>{    
    return dispatch =>{
        dispatch(startFetching())        
        return restApi ("get", `/user/${userId}/event/${eventId}/join`)
            .then((response)=>{
                dispatch(removeError())            
                dispatch(setEvents(response))
            })
            .catch((error)=>{
               }
            )
    
    }
}

export const leaveEvent =  (eventId) =>{
    return dispatch =>{
        dispatch(startFetching())
        return restApi ("get", `/user/${userId}/event/${eventId}/leave`)
        .then((response)=>{
            dispatch(removeError())            
            dispatch(setEvents(response))
        })
        .catch((error)=>{
            
        })
    
    }
}

export const deleteEvent = (eventId) =>{
    return dispatch =>{
        return restApi ("get",`/user/${userId}/event/${eventId}/delete`)
            .then((response)=>{
                dispatch(removeError())            
                dispatch(setEvents(response))
            })
            .catch((error)=>{
                }
            )
    }
}

