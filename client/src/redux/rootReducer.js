import userReducer from "./reducers/user.reducer";
import {combineReducers} from "redux";
import storage from "redux-persist/lib/storage";
import {persistReducer} from "redux-persist";
import groupReducer from "./reducers/group.reducer";
import eventReducer from "./reducers/event.reducer";
import errorReducer from "./reducers/error.reducer";


const persistConfig = {
    key: "root", //at what point do we want to start data
    storage,
}

const rootReducer = combineReducers({
    user: userReducer,
    groups: groupReducer,
    events: eventReducer,
    errors: errorReducer

})

export default persistReducer(persistConfig, rootReducer)