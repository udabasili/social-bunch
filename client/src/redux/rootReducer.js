import userReducer from "./reducers/user.reducer";
import {combineReducers} from "redux";
import storage from "redux-persist/lib/storage";
import {persistReducer} from "redux-persist";
import groupReducer from "./reducers/group.reducer";
import eventReducer from "./reducers/event.reducer";
import errorReducer from "./reducers/error.reducer";
import messageReducer from "./reducers/message.reducer";
import notificationReducer from "./reducers/notification.reducer";
import postReducer from "./reducers/post.reducer";

const persistConfig = {
    key: "root", 
    storage,
}

const rootReducer = combineReducers({
    user: userReducer,
    groups: groupReducer,
    events: eventReducer,
    errors: errorReducer,
    messages: messageReducer,
    notification: notificationReducer,
    posts: postReducer

})

export default persistReducer(persistConfig, rootReducer)