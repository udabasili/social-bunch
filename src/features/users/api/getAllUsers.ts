import { UserAttributes } from "@/features/user/types";
import { useCollection } from "swr-firestore-v9";

type UseGetUsersOptions = {
    [x: string]: UserAttributes
}
export const UseGetUsers = () => {

    const { data, error } = useCollection<UserAttributes>( `users`);

    return {
        error,
        users: data,
        isLoading: !error && !data
    }

}