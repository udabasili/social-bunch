import { GET_MESSAGES } from "../actionType/user.actionType";
import { restApi} from "../../services/api";
import { startFetching } from "./fetch.actions";
import { sendPrivateMessage } from "../../services/socketIo";
import axios from 'axios'
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

export const sendMessage = (receiverId,body, headers) =>{
    let userId = sessionStorage.getItem("userId");    
    return dispatch =>{
        const header = {
            headers
		};
        return restApi("post", `/user/${userId}/send-message/${receiverId}`, body, header)
            .then((response)=>{
                sendPrivateMessage(null, userId, receiverId, null, body.chatId)
            })
            .catch((error)=>{
                console.log(error.message)
                }
            )
        }
}


