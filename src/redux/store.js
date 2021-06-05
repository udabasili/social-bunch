import rootReducer from "./rootReducer";
import {
    createStore,
    compose,
    applyMiddleware
} from "redux";
import {
    persistStore
} from "redux-persist";
import thunk from "redux-thunk";
import { f } from "../services/firebase";
import { getFirebase } from 'react-redux-firebase'
import { getFirestore, createFirestoreInstance } from 'redux-firestore' 

const middlewares = [thunk.withExtraArgument({
    getFirebase,
    getFirestore
})]

const rfConfig = {
    userProfile: 'users',
    presence: 'presence',
    sessions: 'sessions',
    useFirestoreForProfile: true
}



const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(rootReducer, 
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


