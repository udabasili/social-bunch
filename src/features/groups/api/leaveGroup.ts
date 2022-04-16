import { setError } from "@/features/error/reducer/errorSlice";
import { UserAttributes } from "@/features/user/types";
import { useAppDispatch } from "@/store";
import { AxiosError } from "axios";
import { FirebaseError } from "firebase/app";
import { arrayRemove, arrayUnion } from "firebase/firestore";
import { useDocument } from "swr-firestore-v9";


export const useLeaveGroup = (groupId: string) => {

    const {  update, mutate } = useDocument(`groups/${groupId}`)
    const dispatch = useAppDispatch()

    async function leaveGroupFn(user: Partial<UserAttributes> ) {

        try {
            await update({
                members: arrayRemove({
                    uid: user.uid,
                    username: user.username,
                    image: user.image
                })
            })

            mutate()


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
        leaveGroupFn,
    }
}
  