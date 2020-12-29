import { GET_MESSAGES } from "../actionType/user.actionType";
import { restApi} from "../../services/api";
import { startFetching } from "./fetch.actions";
import { sendPrivateMessage } from "../../services/socketIo";

export const loadMessages = (messages) =>({
    type: GET_MESSAGES,
    payload: messages
})


export const getMessages = (userId, recipientId) => {    
    console.log(userId, recipientId)
    return dispatch =>{
        return new Promise((resolve, reject)=>{
            return restApi("get",`/user/${userId}/messages/${recipientId}`)
                .then(response =>{       
                    return resolve(response)
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
                sendPrivateMessage(body.message, userId, receiverId, null, body.chatId)
            })
            .catch((error)=>{
                }
            )
        }
}


