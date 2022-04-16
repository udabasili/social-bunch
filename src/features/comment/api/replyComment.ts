import { clearError, setError } from "@/features/error/reducer/errorSlice"
import { useAuth } from "@/lib/auth"
import { useAppDispatch } from "@/store"
import { generateId } from "@/utils/generateId"
import { AxiosError } from "axios"
import { FirebaseError } from "firebase/app"
import { arrayUnion } from "firebase/firestore"
import { useDocument } from "swr-firestore-v9"
import { CommentDTO } from "../type"

type replyPostCommentOptions = {
    reply: string
}
export const useReplyComment = (commentId: string) => {

    const { currentUser } = useAuth()
    const {  update } = useDocument(`comments/${commentId}`)
    const dispatch = useAppDispatch()
    const id = generateId()

    const addReplyToComment = async ({ reply }: replyPostCommentOptions) => {
        try {
            dispatch(clearError());
            let replyObject = {
                _id: id,
                author: {
                    _id: currentUser.uid,
                    username: currentUser.username,
                    image: currentUser.image
                },
                comment: reply,
                createdOn: Date.now()
            }
            await update({
                replies: arrayUnion(replyObject)
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
        addReplyToComment
    }

}
