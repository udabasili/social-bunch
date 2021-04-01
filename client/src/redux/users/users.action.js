import { GET_ALL_USERS } from "./users.actionTypes";
import axios from "axios";
import { toast } from "react-toastify";

export const setAllUsers = (user) =>({
    type: GET_ALL_USERS,
    payload: user
})

export const getAllUsers = () => {
    return dispatch => {
        return axios({
            method: 'GET',
            url: '/api/all-users/'
        })
        .then((response) => {
            return dispatch(setAllUsers(response.data.message))
        })
        .catch((err) => {
            toast.error(err.response.data.message)
            throw err.response.data.message
        })
    }
}

export const getUserById = (id) => {
    return axios({
            method: 'GET',
            url: `/api/all-users/${id}`
        })
        .then((response) => {
            return response.data.message
        })
        .catch((err) => {
            throw err.response.data.message
    })

}



