import rootReducer from "./rootReducer";
import {
    createStore,
    compose,
    applyMiddleware
} from "redux";
import thunk from "redux-thunk";
import { f } from "../services/firebase";
import { getFirebase } from 'react-redux-firebase'
import { getFirestore, createFirestoreInstance } from 'redux-firestore' 
import { persistStore, persistReducer } from 'redux-persist'
import localStorage from 'redux-persist/lib/storage' 
const middlewares = [thunk.withExtraArgument({
    getFirebase,
    getFirestore
})]

const persistConfig = {
    key: 'root',
    storage: localStorage
}


const rfConfig = {
    userProfile: 'users',
    presence: 'presence',
    sessions: 'sessions',
    useFirestoreForProfile: true
}

const persistedReducer = persistReducer(persistConfig, rootReducer)


const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(persistedReducer,
     composeEnhancers(
         applyMiddleware(...middlewares),
     )
)

export const rrfProps = {
    firebase: f,
    config: rfConfig,
    dispatch: store.dispatch,
    createFirestoreInstance 
}


export const persistor = persistStore(store)
 


