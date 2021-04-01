import {GET_EVENTS} from "./event.actionType"

const INITIAL_STATE = {
    isFetching:false,
    events:[]
}

export default function eventReducer (state=INITIAL_STATE, action){
    switch (action.type) {
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