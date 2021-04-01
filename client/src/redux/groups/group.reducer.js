import {GET_GROUPS} from "./group.actionType"

const INITIAL_STATE = {
    isFetching: false,
    groups: []
}

export default function groupReducer (state=INITIAL_STATE, action){
    switch (action.type) {
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