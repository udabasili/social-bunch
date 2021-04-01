import { GET_NOTIFICATIONS } from "./notification.actionTypes"

const initialState = {
    notifications:[],
    unReadCount: 0

}
const notificationReducer = (state = initialState, action) => {
    switch(action.type){
        case GET_NOTIFICATIONS:
            return {
                ...state,
                notifications: action.payload,
                unReadCount: action.payload.filter((data) => (
                    !data.textRead
                )).length
            }
        
            default :
                return state
    }
}

export default notificationReducer
