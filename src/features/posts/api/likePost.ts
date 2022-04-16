import { clearError, setError } from "@/features/error/reducer/errorSlice";
import { useAppDispatch } from "@/store";
import { AxiosError } from "axios";
import { FirebaseError } from "firebase/app";
import { arrayUnion } from "firebase/firestore";
import { useDocument } from "swr-firestore-v9";
import { PostLikedBy } from "../types";

type likePostOptions = {
    postOwner: string
    likedBy: PostLikedBy
}

export const useLikePost = (postId: string) => {

    const { update } = useDocument(`posts/${postId}`)
    const dispatch = useAppDispatch()

    const likePost = async ({postOwner, likedBy}: likePostOptions) => {
        try {
            dispatch(clearError())
             update({
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
        likePost
    }
    
}