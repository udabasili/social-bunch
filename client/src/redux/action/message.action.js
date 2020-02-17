import { GET_MESSAGES } from "../actionType/user.actionType";
import { restApi} from "../../services/api";
import { removeError, addError } from "./errors.action";
import { startFetching } from "./fetch.actions";
import { setCurrentUser } from "./user.action";

let userId = sessionStorage.getItem("userId");
export const loadMessages = (messages) =>({
    type: GET_MESSAGES,
    payload: messages
})


export const getMessages = (userId, recipientId) => {
    
    return dispatch =>{
        return restApi("get",`/user/${userId}/messages/${recipientId}`)
        .then(response =>{            
            dispatch(loadMessages(response))
        })
        .catch(error => {
            console.log(error.message)
        })
    }
}

export const sendMessage = (receiverId,body) =>{  
    return dispatch =>{
        dispatch(startFetching())
        return restApi("post", `/user/${userId}/send-message/${receiverId}`, body)
            .then((response)=>{                         
                dispatch(removeError())           
                dispatch(loadMessages(response.messages));
                let currentUser = response.filteredUser
                dispatch(setCurrentUser(currentUser))
            
            })
            .catch((error)=>{
                dispatch(addError("Something went Wrong. Try Again Later"))
                }
            )
        }
}


