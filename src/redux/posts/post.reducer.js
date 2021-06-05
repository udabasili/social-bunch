import { GET_POSTS } from "./post.actionType"

const postReducer = (state = [], action) => {
    switch(action.type){
        case GET_POSTS:
            return [...action.payload]
        
            default :
                return state
    }
}

export default postReducer
