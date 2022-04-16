import { clearError, setError } from "@/features/error/reducer/errorSlice"
import { useAppDispatch } from "@/store"
import { AxiosError } from "axios"
import { FirebaseError } from "firebase/app"
import { arrayRemove, arrayUnion } from "firebase/firestore"
import { useDocument } from "swr-firestore-v9"
import { CommentDTO } from "../type"

type editPostCommentOptions = {
    commentContent: CommentDTO
    postOwner: string
}

type useLikeCommentCommentProps = {
    commentId: string
}
export const useLikeComment = ( {commentId}: useLikeCommentCommentProps) => {

    const {  update } = useDocument(`comments/${commentId}`)
    const dispatch = useAppDispatch()

    const removeLikeFromComment = async (likedBy: string) => {
        try {
            dispatch(clearError());
            await update({
                likes: arrayRemove(likedBy)
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
       
   
    };
    
    const addLikeToComment =  async (likedBy: string) => {
        try {
            dispatch(clearError());
            await update({
                likes: arrayUnion(likedBy)
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
       
   
    };

    return {
        addLikeToComment,
        removeLikeFromComment
    }

}
