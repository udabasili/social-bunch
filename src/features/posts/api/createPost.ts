import { clearError, setError } from "@/features/error/reducer/errorSlice";
import { useAuth } from "@/lib/auth";
import { storage } from "@/lib/fuego";
import { useAppDispatch } from "@/store";
import { generateId } from "@/utils/generateId";
import { AxiosError } from "axios";
import { FirebaseError } from "firebase/app";
import { arrayUnion } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { toast } from "react-toastify";
import { useCollection, useDocument } from "swr-firestore-v9";
import {  PostDTO } from "../types";

export type CreatePostDTO = {
    postData: PostDTO;
    type: 'text' | 'video'


};

type uploadEachPostImageProps = {
    files: Array<File>
    userId: string
}

const uploadEachPostImage = async ({files, userId}: uploadEachPostImageProps) => {

	const imageUrls = await Promise.all(files.map(file => { 
        const id = generateId()
		return new Promise((resolve, reject) => {
            const uploadRef = ref(storage, `posts/${userId}/${id}`);
            const uploadTask = uploadBytesResumable(uploadRef, file);
			uploadTask.on('state_changed', (snapshot) => {
					const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
					console.log("Progress: ", progress)
				},
				reject,
				async () => {
                    return getDownloadURL(uploadRef).then((url) => {
                        console.log(url)
                      return resolve(url);
                    });
                  }
            );
		})}
	))
	return imageUrls
}

type CreatePostOptions = {
    postData: PostDTO;
    type: 'text' | 'video'
}

type CreateOImagePostOptions = {
    files: Array<File>;
    title: string
}

export const useCreatePost = () => {

    const { currentUser } = useAuth()
    const {  add } = useCollection('posts')
    const {  update } = useDocument(`users/${currentUser.uid}`)
    const dispatch = useAppDispatch()
    const id = generateId()

    async function createPostFn({ postData, type}: CreatePostOptions) {

        let  newPost = {}
        if (type === 'text') {
			newPost = {
				video: {
					title: null,
					link: null
				},
				text: postData.text,
				user: {
                    uid: currentUser.uid,
                    username: currentUser.username,
                    image: currentUser.image
                },
				type,
				likes:[],
				createdAt: new Date(),
				updatedAt: new Date()
			}
		} else if (type === 'video') {
			newPost = {
				video: {
					title: postData.title,
					link: postData.link
				},
				user: {
                    uid: currentUser.uid,
                    username: currentUser.username,
                    image: currentUser.image
                },
				likes: [],
				type,
				createdAt: new Date(),
				updatedAt: new Date()
			}
		}
        try {
            await add({
                id,
                ...newPost
            })
            update({
                posts: arrayUnion(id)
            })  
            toast.success('New Post Added')

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

    async function createImagePostFn({files, title}: CreateOImagePostOptions) {
            const userId = currentUser.uid
            const imageUrls = await uploadEachPostImage({files, userId})
            let newPost = {
                id,
                user: {
                    uid: currentUser.uid,
                    username: currentUser.username,
                    image: currentUser.image
                },
                image: {
                    title,
                    images: imageUrls
                },
                type: 'image',
                likes: [],
                createdAt: new Date(),
                updatedAt: new Date()
            }
            try {
                dispatch(clearError())
                await add({
                    ...newPost
                }) 
                 update({
                    posts: arrayUnion(id)
                })  
                toast.success('New Post Added')

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
        createPostFn,
        createImagePostFn
    }
}
  