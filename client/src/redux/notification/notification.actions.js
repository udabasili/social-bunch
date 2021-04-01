import { GET_NOTIFICATIONS } from "./notification.actionTypes";
import axios from "axios";

export const loadNotifications = (notification) =>({
    type: GET_NOTIFICATIONS,
    payload: notification
})

export const markMessageRead = (notificationId) => (dispatch, getState) => {
	const { user } = getState();
	const id = user.currentUser._id
	return axios({
		url: `/api/user/${id}/notifications/${notificationId}/edit`,
		method: 'PUT',
		withCredentials: true
	})
	.then((response) => {
	})
	.catch((err) => {
		throw err.response.data.message
	});
};
