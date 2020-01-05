import {
     GET_EVENTS
    } from "../actionType/event.actionType";

export const setEvents = (events) =>({
    type: GET_EVENTS,
    payload: events

}) 