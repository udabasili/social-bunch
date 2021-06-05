import { SET_CURRENT_USER } from "../actionType";

const initialState = {
    currentUser: {},
    authenticated: false
}

export default function userReducer (state = initialState, action) {
    
    switch (action.type) {
        case SET_CURRENT_USER:
        return {
            ...state,
            currentUser: action.payload,
            authenticated: Object.keys(action.payload).length > 0 && 
            action.payload.fullAuthenticated ?
            true :
            false,
            
        };
    default:
        return state;
    }
}