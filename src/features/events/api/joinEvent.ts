import { setError } from "@/features/error/reducer/errorSlice";
import { UserAttributes } from "@/features/user/types";
import { useAppDispatch } from "@/store";
import { AxiosError } from "axios";
import { FirebaseError } from "firebase/app";
import { arrayUnion } from "firebase/firestore";
import { useDocument } from "swr-firestore-v9";


export const useJoinEvent = (eventId: string) => {

    const {  update } = useDocument(`events/${eventId}`)
    const dispatch = useAppDispatch()

    async function joinEventFn(user: Partial<UserAttributes> ) {

        try {
             update({
                attenders: arrayUnion({
                    uid: user.uid,
                    username: user.username,
                    image: user.image
                })
            })

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
        joinEventFn,
    }
}
  