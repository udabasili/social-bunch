import {START_FETCHING, ERROR_FETCHING} from "../actionType/fetch.actionTypes";

export const startFetching = () =>({
    type: START_FETCHING,

}) 

export const fetchFailed = (error) =>({
    type: ERROR_FETCHING,
    payload: error
})