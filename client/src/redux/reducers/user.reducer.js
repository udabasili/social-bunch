import { 
    CURRENT_USER,
    GET_USERS,
    } from "../actionType/user.actionType"

import {START_FETCHING, ERROR_FETCHING} from "../actionType/fetch.actionTypes"

const INITIAL_STATE = {
    isFetching:false,
    errorMessage:null,
    users:[],
    currentUser:null,
}

export default function userReducer (state=INITIAL_STATE, action){
    switch (action.type) {
        case START_FETCHING:
            return{
                ...state,
                isFetching:true
            }

        case ERROR_FETCHING:
            return{
                ...state,
                errorMessage:action.payload,
                isFetching:false,

            }
        case CURRENT_USER:
            return {
                ...state,
                isFetching: false,
                currentUser: action.payload
            }
        case GET_USERS:
            return {
                ...state,
                isFetching: false,
                users: action.payload
            }
    
        default:
            return state
    }
}