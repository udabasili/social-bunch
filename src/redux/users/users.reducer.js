import { GET_ALL_USERS } from "./users.actionTypes";

const initialState = {
    allUsers: [],
    total: false
}

export default function usersReducer (state = initialState, action) {
    
    switch (action.type) {
        case GET_ALL_USERS:
        return {
            ...state,
            allUsers: action.payload || [],
            total: action.payload.length
            
        };
    default:
        return state;
    }
}