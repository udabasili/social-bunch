import { setError } from "@/features/error/reducer/errorSlice";
import { useAppDispatch } from "@/store";
import { AxiosError } from "axios";
import { FirebaseError } from "firebase/app";
import { useNavigate } from "react-router-dom";
import { useDocument } from "swr-firestore-v9";


export const useDeleteGroup = (groupId: string) => {

    const {  deleteDocument } = useDocument(`groups/${groupId}`)
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    async function deleteGroupFn( ) {

        try {
            
            await deleteDocument()
            navigate('/groups')

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
        deleteGroupFn,
    }
}
  