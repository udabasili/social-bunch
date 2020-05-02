import { ADD_ERROR, REMOVE_ERROR } from "../actionType/error.actionType";

export const addError  = error => ({
    type: ADD_ERROR,
    payload: error
})

export const removeError  = () => ({
    type: REMOVE_ERROR,
})