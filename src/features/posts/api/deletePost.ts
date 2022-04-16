import { clearError, setError } from "@/features/error/reducer/errorSlice";
import { useAuth } from "@/lib/auth";
import { useAppDispatch } from "@/store";
import { AxiosError } from "axios";
import { FirebaseError } from "firebase/app";
import { arrayRemove } from "firebase/firestore";
import { useDocument } from "swr-firestore-v9";

export const useDeletePost = (postId: string) => {

    const { currentUser } = useAuth()
    const {
        deleteDocument,
    } = useDocument(`posts/${postId}`)
    const dispatch = useAppDispatch()
    const { update } = useDocument(`users/${currentUser.uid}`)

    async function deletePostFn() {
        try {
            dispatch(clearError())
            await deleteDocument()
             update({
                posts: arrayRemove(postId)
            })

        } catch (error) {
            let errorMessage = ''
            const errorObject = error as AxiosError;
            if (errorObject.name === 'FirebaseError') {
                errorMessage = (error as FirebaseError).message
            } else if (errorObject.isAxiosError) {
                errorMessage = errorObject.response?.data.message
            } else {
                errorMessage = errorObject.message
            }
            dispatch(setError(errorMessage));
            throw error
        }

    }

    return {
        deletePostFn
    }

};