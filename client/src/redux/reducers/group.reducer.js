import {GET_GROUPS} from "../actionType/group.actionType"

import {START_FETCHING, ERROR_FETCHING} from "../actionType/fetch.actionTypes"

const INITIAL_STATE = {
    isFetching:false,
    errorMessage:null,
    groups: null
  
}

export default function groupReducer (state=INITIAL_STATE, action){
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
        case GET_GROUPS:
            return {
                ...state,
                isFetching: false,
                groups: action.payload
            }

        default:
            return state
    }
}