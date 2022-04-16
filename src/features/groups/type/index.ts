import { UserAttributes } from "@/features/user/types"

export type GroupAttributes = {
    id: string
    groupName: string
    category: string
    members: Array<Partial<UserAttributes>>
    description: string
    imageUrl: string
    createdBy: Partial<UserAttributes>

}

export type GroupDTO = {
    groupName: string
    category: string
    imageUrl: string
    description: string
}