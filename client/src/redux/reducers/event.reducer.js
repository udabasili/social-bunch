import {GET_EVENTS} from "../actionType/event.actionType"

import {START_FETCHING} from "../actionType/fetch.actionTypes"

const INITIAL_STATE = {
    isFetching:false,
    events:null,

}

export default function groupReducer (state=INITIAL_STATE, action){
    switch (action.type) {
        case START_FETCHING:
            return{
                ...state,
                isFetching:true
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