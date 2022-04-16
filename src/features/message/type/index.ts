export type MessageAttributes = {
    _id: string
    id: number
    text: string
    createdBy: string
    read: boolean
    otherUserId: string
    status: "sending" | "delivered"
    createdAt: Date
}

export type MessageOTP = {
    text: string
    createdBy: string
    chatId: string
    createdAt: number
    updatedAt: number
}

export type OnlineProps = { 
    last_changed: number, 
    state: "online" | 'offline'
}