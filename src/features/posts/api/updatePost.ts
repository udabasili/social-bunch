import { clearError, setError } from "@/features/error/reducer/errorSlice";
import { useAppDispatch } from "@/store";
import { AxiosError } from "axios";
import { FirebaseError } from "firebase/app";
import { useDocument } from "swr-firestore-v9";
import { PostAttribute } from "../types";

type updatePostOptions = {
    updatedPost: PostAttribute
}

export const useUpdatePost = (postId: string) => {

    const { update } = useDocument(`posts/${postId}`)
    const dispatch = useAppDispatch()

    const updatePost = async ({updatedPost}: updatePostOptions) => {

            let post;
            if (updatedPost.type === 'text') {
                post = {
                    text: updatedPost.text,
                    updatedAt: new Date()
                }
            } else if (updatedPost.type === 'video') {
                post = {
                    video: {
                        title: updatedPost.title,
                        link: updatedPost.link
                    },
                    updatedAt: new Date()
                }
            }
            try {
                dispatch(clearError())
                await update({
                    ...post
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
        updatePost
    }
    
}
