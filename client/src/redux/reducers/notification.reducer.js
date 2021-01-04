import { SET_NOTIFICATIONS, SHOW_NOTIFICATIONS_DROPDOWN } from "../actionType/notfication.actionType";
const initialState ={
    showNotifications: false,
    notifications:[]
}

export default function notificationReducer(state = initialState, action) {
  switch (action.type) {
    
    case SHOW_NOTIFICATIONS_DROPDOWN:
      return {
        ...state,
        showNotifications: action.payload !== null  ? action.payload : !state.showNotifications
        
      };
    case  SET_NOTIFICATIONS:
      return {
        ...state,
        notifications: action.payload
        
      };
     
    default:
      return state;
  }
}