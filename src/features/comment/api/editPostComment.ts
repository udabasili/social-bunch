import { clearError, setError } from "@/features/error/reducer/errorSlice"
import { useAppDispatch } from "@/store"
import { AxiosError } from "axios"
import { FirebaseError } from "firebase/app"
import { useDocument } from "swr-firestore-v9"
import { CommentDTO } from "../type"

type editPostCommentOptions = {
    commentContent: CommentDTO
}
export const useEditPostComment = (commentId: string) => {

    const {  update } = useDocument(`comments/${commentId}`)
    const dispatch = useAppDispatch()
    
    const editPostComment = async ({ commentContent}: editPostCommentOptions) => {
        try {
            dispatch(clearError());
            await update({
                ...commentContent,

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
        editPostComment
    }

}
