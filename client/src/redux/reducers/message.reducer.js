import { GET_MESSAGES } from "../actionType/user.actionType";


export default function  messageReducer (state = {messages: null}, action)  {
    switch (action.type) {
        case GET_MESSAGES:
            return  {
                messages: action.payload
            }      
        default:
            return state
    }
}