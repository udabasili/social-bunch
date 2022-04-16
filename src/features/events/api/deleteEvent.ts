import { setError } from "@/features/error/reducer/errorSlice";
import { useAppDispatch } from "@/store";
import { AxiosError } from "axios";
import { FirebaseError } from "firebase/app";
import { useDocument } from "swr-firestore-v9";


export const useDeleteEvent = (eventId: string) => {

    const {  deleteDocument } = useDocument(`events/${eventId}`)
    const dispatch = useAppDispatch()

    async function deleteEventFn( ) {

        try {
             deleteDocument()
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
        deleteEventFn,
    }
}
  