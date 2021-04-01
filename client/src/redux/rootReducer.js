import { combineReducers } from "redux";
import userReducer from "./user/user.reducer";
import storageSession from 'redux-persist/lib/storage/session';
import {
    persistReducer
} from 'redux-persist'
import postReducer from "./posts/post.reducer";
import notificationReducer from "./notification/notification.reducer";
import usersReducer from "./users/users.reducer";
import eventReducer from "./events/event.reducer";
import groupReducer from "./groups/group.reducer";
import messagesReducer from "./message/message.reducer";

const persistConfig = {
    key: 'root',
    storage: storageSession,
    blacklist: ['messages']
}

const rootReducer =  combineReducers({
  user: userReducer,
  posts: postReducer,
  notifications: notificationReducer,
  users: usersReducer,
  events: eventReducer,
  groups: groupReducer,
  messages: messagesReducer
});

export default persistReducer(persistConfig, rootReducer)
