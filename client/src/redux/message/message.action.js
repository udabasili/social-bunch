
import axios from 'axios';
import { GET_MESSAGES } from './message.actionType';

export const setMessages = (messages) => ({
    type: GET_MESSAGES,
    payload: messages

})
export const getCurrentUserMessages = () => (dispatch, getState) => {
    const { user } = getState();
    const userId = user.currentUser._id  
    return axios({
        url: `/api/user/${userId}/messages/`,
        method: 'GET',
        withCredentials: true
    }).then(response => {
        dispatch(setMessages(response.data.message))
        return response
    })
    .catch(error => {
        throw error.response.data.message
    })
    
}

export const setReadMessages = (recipientId) => (dispatch, getState) => {
    const {
        user
    } = getState();
    const userId = user.currentUser._id
    return axios({
            url: `/api/user/${userId}/messages/${recipientId}/set-read`,
            method: 'PUT',
            withCredentials: true
        }).then(response => {
            dispatch(setMessages(response.data.message))
            return response
        })
        .catch(error => {
            throw error.response.data.message
        })
}

export const getMessages = (userId, recipientId) => {    
    return new Promise((resolve, reject)=>{
        return axios({
            url: `/api/user/${userId}/messages/${recipientId}`,
            method: 'GET',
            withCredentials: true
        }).then(response =>{       
            return resolve(response.data.message)
        })
        .catch(error => {            
            return reject()
        })
    })
}



