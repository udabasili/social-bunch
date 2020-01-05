import {
    GET_GROUPS, 
    } from "../actionType/group.actionType";

export const setGroups = (groups) =>({
    type: GET_GROUPS,
    payload: groups

}) 

