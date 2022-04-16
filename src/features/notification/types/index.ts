import { UserAttributes } from "@/features/user/types"

export type NotificationProps = {
    _id: string
    type: string,
    postId: string,
    owner: string,
    textRead: boolean,
    createdAt: {seconds: number},
    updatedAt: {seconds: number},
    notificationAbout: UserAttributes
}

export type NotificationDTO = {
    type: string,
    postId: string,
    owner: string,
    notificationAbout: UserAttributes
}