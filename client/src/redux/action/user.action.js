import { 
    CURRENT_USER,
    GET_USERS,
    } from "../actionType/user.actionType"


export const setAllUsers = (users) =>({
    type: GET_USERS,
    payload: users
}) 
export const setCurrentUser = (user) =>({
    type: CURRENT_USER,
    payload: user
}) 
