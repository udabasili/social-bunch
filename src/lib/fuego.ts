import { initializeApp } from 'firebase/app';
import 'firebase/firestore'
import 'firebase/database'
import 'firebase/auth'
import 'firebase/storage'
import { Fuego } from 'swr-firestore-v9'
import { getFirestore} from "firebase/firestore";
import { getDatabase } from 'firebase/database';
import { getStorage } from "firebase/storage";


const firebaseConfig = {
    apiKey: "AIzaSyA0pbb1VW6eB_VhtYJwyPcR1GWz0SbS9hw",
    authDomain: "social-bunch-app.firebaseapp.com",
    databaseURL: "https://social-bunch-app-default-rtdb.firebaseio.com",
    projectId: "social-bunch-app",
    storageBucket: "social-bunch-app.appspot.com",
    messagingSenderId: "26239972230",
    appId: "1:26239972230:web:5a47ba8023c9fdc10f3207",
    measurementId: "G-H8DGM9R2TC"

};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const database = getDatabase(app);
export const storage = getStorage(app);
export const fuego = new Fuego(firebaseConfig)
