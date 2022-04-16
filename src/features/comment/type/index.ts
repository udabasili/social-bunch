export type CommentAttributes = {
    _id: string
    authorImage: string
    authorName: string
    createdOn: {seconds: number}
    comment: string
    likes: Array<string>
    replies: Array<CommentReplyAttributes>
}

export type CommentReplyAttributes = {
    _id: string
    author: {
        uid: string,
        username: string,
        image: string
    },
    createdOn: {seconds: number}
    updatedOn: {seconds: number}
    comment: string
}

export type CommentDTO = {
    authorImage?: string
    authorName: string
    createdOn: Date
    comment: string
}