import { clearError, setError } from "@/features/error/reducer/errorSlice"
import { addNotification } from "@/features/notification/api/addNotification"
import { useAuth } from "@/lib/auth"
import { useAppDispatch } from "@/store"
import { generateId } from "@/utils/generateId"
import { AxiosError } from "axios"
import { FirebaseError } from "firebase/app"
import { arrayUnion } from "firebase/firestore"
import { useMemo } from "react"
import { useCollection, useDocument } from "swr-firestore-v9"
import { CommentDTO } from "../type"

type addCommentToPostOptions = {
    commentContent: CommentDTO
    postOwner: string
}
export const useAddCommentToPost = (postId: string) => {

    const id = useMemo(() =>  generateId() , [])
    const { currentUser } = useAuth()
    const { set } = useDocument(`comments/${id}`)
    const {  update } = useDocument(`posts/${postId}`)
    const dispatch = useAppDispatch()
    
    const addCommentToPost = async ({ commentContent,  postOwner}: addCommentToPostOptions) => {
        try {
            dispatch(clearError());
            await set({
                _id: id,
                ...commentContent,
                replies: [],
                likes: []
            })
            await update({
				comments: arrayUnion(id)
			})
            if (currentUser.uid !== postOwner) {
                const type = "liked"
                const notificationAbout = currentUser
                const owner = postOwner
                await addNotification({type, postId, owner, notificationAbout})
            }
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
        addCommentToPost
    }

}
