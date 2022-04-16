import { setError } from "@/features/error/reducer/errorSlice";
import { useAuth } from "@/lib/auth";
import { useAppDispatch } from "@/store";
import { generateId } from "@/utils/generateId";
import { AxiosError } from "axios";
import { FirebaseError } from "firebase/app";
import { toast } from "react-toastify";
import { useCollection } from "swr-firestore-v9";
import { GroupDTO } from "../type";


export const useCreateGroup = () => {

    const { currentUser } = useAuth()
    const {  add } = useCollection('groups')
    const dispatch = useAppDispatch()
    const id = generateId()

    async function createGroupFn( groupRecord : GroupDTO) {

        try {
            let members = [];
            members.push({
                uid: currentUser.uid,
                username: currentUser.username,
                image: currentUser.image
            })
            const groupData = {
                groupName: groupRecord.groupName,
                description: groupRecord.description,
                imageUrl: groupRecord.imageUrl,
                category: groupRecord.category,
                createdAt: new Date(),
                createdBy: {
                    uid: currentUser.uid,
                    username: currentUser.username,
                    image: currentUser.image
                },
                members,
                updatedAt: new Date()
            }
            await add({
                ...groupData
            })
            toast.success('New Group Added')

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
        createGroupFn,
    }
}
  