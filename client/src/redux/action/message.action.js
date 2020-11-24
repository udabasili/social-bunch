import { GET_MESSAGES } from "../actionType/user.actionType";
import { restApi} from "../../services/api";
import { removeError, addError } from "./errors.action";
import { startFetching } from "./fetch.actions";
import { setCurrentUser } from "./user.action";
import { toast } from 'react-toastify';

export const loadMessages = (messages) =>({
    type: GET_MESSAGES,
    payload: messages
})


export const getMessages = (userId, recipientId) => {    
    return dispatch =>{
        return new Promise((resolve, reject)=>{
            return restApi("get",`/user/${userId}/messages/${recipientId}`)
                .then(response =>{       
                    dispatch(loadMessages(response))            
                    return resolve()
                })
                .catch(error => {            
                    return reject()
            })
        })
    }
}

export const sendMessage = (receiverId,body) =>{
    let userId = sessionStorage.getItem("userId");    
    return dispatch =>{
        dispatch(startFetching())
        return restApi("post", `/user/${userId}/send-message/${receiverId}`, body)
            .then((response)=>{
                dispatch(removeError())
                dispatch(loadMessages(response.messages));
                let currentUser = response.currentUser
                dispatch(setCurrentUser(currentUser))
            })
            .catch((error)=>{
                }
            )
        }
}


