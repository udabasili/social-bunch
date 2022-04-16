import { setError } from "@/features/error/reducer/errorSlice";
import { UserAttributes } from "@/features/user/types";
import { useAppDispatch } from "@/store";
import { AxiosError } from "axios";
import { FirebaseError } from "firebase/app";
import { arrayRemove, arrayUnion } from "firebase/firestore";
import { useDocument } from "swr-firestore-v9";


export const useLeaveEvent = (eventId: string) => {

    const {  update } = useDocument(`events/${eventId}`)
    const dispatch = useAppDispatch()

    async function leaveEventFn(user: Partial<UserAttributes> ) {

        try {
            await update({
                attenders: arrayRemove({
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
        leaveEventFn,
    }
}
  