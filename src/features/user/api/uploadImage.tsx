import { firebaseErrors } from "@/data/firebaseErrors";
import { setError } from "@/features/error/reducer/errorSlice";
import { useAuth } from "@/lib/auth";
import { storage } from "@/lib/fuego";
import { useAppDispatch } from "@/store";
import { AxiosError } from "axios";
import { FirebaseError } from "firebase/app";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useDocument } from "swr-firestore-v9";
import { setCurrentUser } from "../reducer/userSlice";
import { UserAttributes } from "../types";

type UploadProps = {
  userId: string;
  file: File | Blob;
};
const upload = async ({ file, userId }: UploadProps) => {
  const uploadRef = ref(storage, `/users/${userId}`);
  const uploadTask = uploadBytesResumable(uploadRef, file);
  const imageUrl = new Promise((resolve, reject) => {
     uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        console.log("Progress: ", progress);
      },
      reject,
      async () => {
        return getDownloadURL(uploadRef).then((url) => {
          return resolve(url);
        });
      }
    )
  });
  return imageUrl;
};


export const useUploadImage = () => {
  const { currentUser } = useAuth();
  const dispatch = useAppDispatch()
  const { data,  update } = useDocument<UserAttributes>(`users/${currentUser.uid}`);

  async function uploadImageFn({file, userId}: UploadProps) {
      try {
        const imageUrl = await upload({file, userId});
        await update({
            image: imageUrl as string,
            fullAuthenticated: false,
            nextRoute: "userInfo",
        });
        console.log('data')
        dispatch(setCurrentUser(data as UserAttributes))

    
      } catch (error) {
        let errorMessage = ''
        const errorObject = error as AxiosError;
        if (errorObject.name === 'FirebaseError'){
            errorMessage = firebaseErrors[(error as FirebaseError).code]
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
    uploadImageFn,
  };
};
