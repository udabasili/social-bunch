import {
    GET_MESSAGES
} from "./message.actionType"

const INITIAL_STATE = {
    messages: [],
    unReadMessages: [],
    unReadMessagesLength: 0,

}

export default function messagesReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        case GET_MESSAGES:
            return {
                ...state,
                messages: action.payload,
                unReadMessages:action.payload.filter((message) => (
                    !message.read
                )),
                unReadMessagesLength: action.payload.filter((message) => (
                    !message.read
                )).length
            }

            default:
                return state
    }
}