import { SET_NOTIFICATIONS, SHOW_NOTIFICATIONS_DROPDOWN } from "../actionType/notfication.actionType"


export const toggleDropdown = (showNotif=null) =>({
    type: SHOW_NOTIFICATIONS_DROPDOWN,
    payload: showNotif
})

export const setNotification = (notifications) =>({
    type: SET_NOTIFICATIONS,
    payload: notifications
})