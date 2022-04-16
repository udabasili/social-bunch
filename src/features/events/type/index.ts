import { UserAttributes } from "@/features/user/types"

export type EventAttributes = {
    id: string
    time: string;
    eventName: string
    category: string
    eventDescription: string
    date: {seconds: number}
    attenders: Array<Partial<UserAttributes>>
    createdBy: Partial<UserAttributes>
    createdAt: {seconds: number}
    updatedAt: {seconds: number}

}

export type EventDTO = {
    eventName: string
    eventTime: string
    category: string
    eventDescription: string
    eventDate: Date

}
