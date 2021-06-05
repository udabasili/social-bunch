import { combineReducers } from "redux";
import userReducer from "./user/user.reducer";

import { firebaseReducer } from 'react-redux-firebase'
import { firestoreReducer } from 'redux-firestore'

const rootReducer =  combineReducers({
  user: userReducer,
  firebase: firebaseReducer,
  firestore: firestoreReducer 
});


export default rootReducer
