export type UserAttributes = {
    uid: string,
    username: string
    email: string
    image?: string
    friends: Array<string>,
    posts:  Array<string>,
    notifications:  Array<object>,
    fullAuthenticated: boolean,
    nextRoute: string
    
}

export type UserInfoDTO = {
    bio: string,
    occupation: string,
    location: string,
    dateOfBirth: Date
}

export type UserState = {
    currentUser: UserAttributes 
    authenticated: boolean
}

export type UserAction = {
    currentUser: UserAttributes
    authenticated: boolean
}