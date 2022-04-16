import { clearError, setError } from "@/features/error/reducer/errorSlice"
import { useAuth } from "@/lib/auth"
import { db } from "@/lib/fuego"
import { useAppDispatch } from "@/store"
import { AxiosError } from "axios"
import { FirebaseError } from "firebase/app"
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore"
import { useDocument } from "swr-firestore-v9"
import { UserAttributes } from "../types"

export const useFriend = () => {

    const { currentUser } = useAuth()
    const { update } = useDocument<UserAttributes>(`users/${currentUser.uid}`)
    const dispatch = useAppDispatch()

    const addFriend = async (friendId: string) => {
        try {
            dispatch(clearError())
            const friendRef = doc(db, "users", friendId);
            const userId = currentUser.uid
            await update({
                friends: arrayUnion(friendId)
            })
            await updateDoc(friendRef, {
                friends: arrayUnion(userId)

            });
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

    const removeFriend = async (friendId: string) => {
        try {
            dispatch(clearError())
            const friendRef = doc(db, "users", friendId);
            const userId = currentUser.uid
            await update({
                friends: arrayRemove(friendId)
            })
            await updateDoc(friendRef, {
                friends: arrayUnion(userId)

            });
           
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
        addFriend,
        removeFriend
    }
}