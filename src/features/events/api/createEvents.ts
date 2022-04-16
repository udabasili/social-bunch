import { clearError, setError } from "@/features/error/reducer/errorSlice";
import { useAuth } from "@/lib/auth";
import { useAppDispatch } from "@/store";
import { generateId } from "@/utils/generateId";
import { AxiosError } from "axios";
import { FirebaseError } from "firebase/app";
import { toast } from "react-toastify";
import { useCollection } from "swr-firestore-v9";
import { EventDTO } from "../type";


export const useCreateEvent = () => {

    const { currentUser } = useAuth()
    const {  add } = useCollection('events')
    const dispatch = useAppDispatch()
    const id = generateId()

    async function createEventFn( eventRecord : EventDTO) {

        try {
            dispatch(clearError())
            let attenders = [];
            attenders.push({
                uid: currentUser.uid,
                username: currentUser.username,
                image: currentUser.image
            })
            const data = {
                eventName: eventRecord.eventName,
                description: eventRecord.eventDescription,
                date: eventRecord.eventDate,
                time: eventRecord.eventTime,
                category: eventRecord.category,
                createdBy: {
                    uid: currentUser.uid,
                    username: currentUser.username,
                    image: currentUser.image
                },
                attenders,
                createdAt: new Date(),
                updatedAt: new Date()
            }
          
            add({
                ...data
            })
            toast.success('New Event Added')

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
        createEventFn,
    }
}
  