import { useCollection, useDocument } from "swr-firestore-v9";
import { GroupAttributes } from "../type";

export const UseGetGroups = (groupId?: string) => {

    const { data, error }  = useCollection<GroupAttributes>(`groups`)
    const groupRef = useDocument<GroupAttributes>(groupId ?  `groups/${groupId}`: null)

    return {
        error,
        groups: data,
        groupPicked: groupRef.data,
        groupLoading: !groupRef.error && !groupRef.data,
        isLoading: !error && !data
    }
}