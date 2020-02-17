import { GET_EVENTS } from "../actionType/event.actionType";
import { removeError, addError } from "./errors.action";
import { restApi } from "../../services/api";
import axios from "axios";
import { startFetching } from "./fetch.actions";

let userId ;

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
    userId = sessionStorage.getItem("userId");    
    return dispatch =>{
        return restApi ("post", `/user/${userId}/create-event/`, event)
            .then((response)=>{         
                console.log(response);
                       
                dispatch(removeError())            
                    dispatch(setEvents(response))
                })
                .catch((error)=>{
                    console.log(error);
                    


        })
    }
}


export const getEventById = async (eventId) =>{
    userId = sessionStorage.getItem("userId");
    return axios.get(`/user/${userId}/event/${eventId}`)
            .then((response)=>{
                return response.data.message
            })
            .catch((error)=>{

            }

        )
    
    }


export const joinEvent = (eventId) =>{    
    userId = sessionStorage.getItem("userId");
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
    userId = sessionStorage.getItem("userId");
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
    userId = sessionStorage.getItem("userId");
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

