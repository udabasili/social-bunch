import { setError } from "@/features/error/reducer/errorSlice"
import { UserAttributes } from "@/features/user/types"
import { useAuth } from "@/lib/auth"
import { database } from "@/lib/fuego"
import { useAppDispatch } from "@/store"
import { AxiosError } from "axios"
import { FirebaseError } from "firebase/app"
import { child, get, ref, update } from "firebase/database"
import { arrayUnion } from "firebase/firestore"
import { useDocument } from "swr-firestore-v9"

interface updateMessageOptions {
    [x: string]: {
        read: boolean
    }
}

export const generateChatId = (sentUserId: string, currentUserId: string) => {
    let keyArray = [];
    keyArray.push(sentUserId);
    keyArray.push(currentUserId);
    keyArray.sort();
    return keyArray.join("_");
}; 

export const useSetReadMessages = () => {
    const dispatch = useAppDispatch()
    const { currentUser } = useAuth()

    async function setReadMessages(recipientId: string ) {

        try {
            const userId = currentUser.uid;
            const chatId = generateChatId(
                recipientId,
                userId
            )
            const dbRef = ref(database);
            const getMessages = await get(child(dbRef, `messages/${chatId}`))
            const exists = getMessages.val() !== null;
            let updateMessage: updateMessageOptions = {};
            if (exists) {
                let allMessages = getMessages.val()
                updateMessage = {...allMessages}
    
                for (let key in allMessages) {
                    updateMessage[key].read = true;
                }
                update(ref(database, 'messages/' + chatId), {
                    ...updateMessage
                  });
    
            }
           
            
     
         

        } catch (error) {
            let errorMessage = ''
            const errorObject = error as AxiosError;
            if (errorObject.name === 'FirebaseError'){
                errorMessage = (error as FirebaseError).message
            } else if (errorObject.isAxiosError) {
				errorMessage = errorObject.response?.data.message
			} else  {
                errorMessage = errorObject.message
            }
			dispatch(setError(errorMessage));
            throw error
        }
        
    }

    return {
        setReadMessages,
    }
}