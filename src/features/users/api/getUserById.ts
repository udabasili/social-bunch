import { UserAttributes, UserInfoDTO } from "@/features/user/types";
import { useDocument } from "swr-firestore-v9";

export const UseGetUserById = (userId?: string) => {

    const { data, error} = useDocument<UserAttributes & UserInfoDTO>(userId ?  `users/${userId}`: null)

    return {
        error,
        user: data,
        isLoading: !error && !data
    }
    
}