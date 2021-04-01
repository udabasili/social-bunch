import { SET_CURRENT_USER } from "../actionType";
import axios from "axios";
import { toast } from "react-toastify";
import { setAllUsers } from "../users/users.action";

export const setCurrentUser = (user) =>({
    type: SET_CURRENT_USER,
    payload: user
})

export const setCsrfToken = async (data) => {
    return new Promise(async (res, rej) =>{
        try {
            const result = await axios.get('/api/public/csrf-token')
            axios.defaults.headers.common['X-CSRF-Token'] = result.data.csrfToken;
            return res()
        } catch (error) {
            console.log(error.message)
            return rej()
        }
    })
}

export function login(userData) {
    return dispatch => {
        return axios.post(
            '/api/auth/login',
            userData, 
            {
                headers: {
                    'content-type': 'application/json'
                },
                withCredentials: true
            }
        )
        .then(res => {
            const response = res.data.message
            sessionStorage.setItem('validator', response.accessToken)
            let currentUser = response.currentUser
            dispatch(setAllUsers(response.users))
            return currentUser
        })
        .catch((error) => {
            toast.error(error.response.data.message)
            throw error.response.data.message
        })
    }
}

export const signUp = (data) => {
    return dispatch => {
        return axios.post(
            '/api/auth/register',
            data, 
            {
                headers: {
                    'content-type': 'application/json'
                },
                withCredentials: true
            }
        ).then((res) =>{
            let currentUser = res.data.newUser
            dispatch(setCurrentUser(currentUser))
            return res
        })
        .catch((error) =>{
            toast.error(error.response.data.message)
            throw error.response.data.message
        })
    }
}

export const uploadImage = (data, userId) => {
    return dispatch => {
        return axios.put(
            `/api/auth/${userId}/avatar/add`,
            data, 
            {
                headers: {
                    'content-type': 'multipart/form-data'
                },
                withCredentials: true
            }
        ).then((res) =>{
            let currentUser = res.data.currentUser
            dispatch(setCurrentUser(currentUser))
            return res
        })
        .catch((error) =>{
            toast.error(error.response.data.message)
            throw error.response.data.message
        })
    }
}

export const addFriend = (friendId) => (dispatch, getState) => {
    const { user } = getState();
    const userId = user.currentUser._id

    return axios({
        url: `/api/users/${userId}/friends/add/${friendId}`,
        method: 'PUT',
        withCredentials: true
    }).then(res => {
        const currentUser = res.data.message
        dispatch(setCurrentUser(currentUser))
        toast.success('Friend Added')
        return res
    })
    .catch((error) => {
        toast.error(error.response.data.message)
        throw error.response.data.message
    })
}

export const removeFriend = (friendId) => (dispatch, getState) => {
    const { user } = getState();
    const userId = user.currentUser._id

    return axios({
        url: `/api/users/${userId}/friends/remove/${friendId}`,
        method: 'DELETE',
        withCredentials: true
    }).then(res => {
        const currentUser = res.data.message
        dispatch(setCurrentUser(currentUser))
        toast.success('Friend removed')
        return res
    })
    .catch((error) => {
        toast.error(error.response.data.message)
        throw error.response.data.message
    })
}


export function editUser(userData, userId) {
    return dispatch => {
        return axios.put(
            `/api/auth/${userId}/profile/add`,
            userData,
            {
                headers: {
                    'content-type': 'application/json'
                },
                withCredentials: true
            })
            .then(res => {           
                const response = res.data.message;
                sessionStorage.setItem('validator', response.accessToken);
                let currentUser = response.currentUser;
                dispatch(setAllUsers(response.users))
                dispatch(setCurrentUser(currentUser))
                return res
            })
            .catch((error)=>{                    
                toast.error(error.response.data.message)
                throw error.response.data.message
        })
    }
}

export const verifyUser = () => {
    return dispatch => {
        const accessToken = sessionStorage.getItem('validator')
        return new Promise((resolve, reject) => {
            return axios({
                url: '/api/verify-user',
                method: 'GET',
                headers:{
                    'authorization': `Bearer ${accessToken}`
                },
                withCredentials: true
            }) 
            .then((res) => {
                const response = res.data.message
                sessionStorage.setItem('validator', response.accessToken)
                let currentUser = response.currentUser
                dispatch(setCurrentUser(currentUser))
                return resolve()
            })
            .catch((error) => {
                sessionStorage.clear()
                dispatch(setCurrentUser({}))
                toast.error("Please log in again")
                return reject(error.response.data.message)
            })
        })
    }
}

export const logOut = () => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            return axios({
                    url: '/api/auth/logout',
                    method: 'GET',
                    withCredentials: true
                })
                .then(() => {
                    sessionStorage.clear()
                    dispatch(setCurrentUser({}))
                    return resolve()
                })
                .catch((error) => {
                    return reject(error.response.data.message)
                })
        })
    }
}

export const testSecuredRoute = (userId) =>{
    return axios({
        url: `/api/secured/${userId}/home/`,
        method: 'GET',
        withCredentials: true
    })
    .then((res) => {
        console.log(res)
    })
    .catch((error) => {
        throw (error.response.data.message)
    })
}

export const refreshToken = async (userId) =>{
    try {
        const response = await axios({
            url: `/api/refresh-token/${userId}`,
            method: 'GET',
            withCredentials: true
        })
        return response.data
    } catch (error) {
        throw error
    }
}
  