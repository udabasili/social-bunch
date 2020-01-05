import {GET_EVENTS} from "../actionType/event.actionType"

import {START_FETCHING, ERROR_FETCHING} from "../actionType/fetch.actionTypes"

const INITIAL_STATE = {
    isFetching:false,
    errorMessage:null,
    events:null,

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
        case GET_EVENTS:
            return {
                ...state,
                isFetching: false,
                events: action.payload
            }

        default:
            return state
    }
}