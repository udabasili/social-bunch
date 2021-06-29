import { combineReducers } from "redux";
import userReducer from "./user/user.reducer";
import { firestoreReducer } from 'redux-firestore'
import { firebaseReducer as firebase } from 'react-redux-firebase'
import { persistReducer } from 'redux-persist'
import localStorage from 'redux-persist/lib/storage' // defaults to localStorage for web and AsyncStorage for react-native
import hardSet from 'redux-persist/lib/stateReconciler/hardSet'

const rootReducer =  combineReducers({
    user: userReducer,
    firestore:  persistReducer(
        { key: 'firebaseState', storage: localStorage, stateReconciler: hardSet },
        firestoreReducer
        ), 
    firebase: persistReducer(
        { key: 'firebaseState', storage: localStorage, stateReconciler: hardSet },
        firebase
        ), 
});


export default rootReducer
