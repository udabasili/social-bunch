import { clearError, setError } from "@/features/error/reducer/errorSlice"
import { useAppDispatch } from "@/store"
import { generateId } from "@/utils/generateId"
import { AxiosError } from "axios"
import { FirebaseError } from "firebase/app"
import { arrayRemove } from "firebase/firestore"
import { useDocument } from "swr-firestore-v9"

export const useDeleteComment = (postId: string, commentId: string) => {

    const { deleteDocument } = useDocument(`comments/${commentId}`)
    const {  update } = useDocument(`posts/${postId}`)
    const dispatch = useAppDispatch()
    
    const deleteComment = async () => {
        try {
            dispatch(clearError());
            await update({
				comments: arrayRemove(commentId)
			})
            await deleteDocument()
            

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
        deleteComment
    }

}
