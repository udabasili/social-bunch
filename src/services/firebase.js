import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';
import 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyA0pbb1VW6eB_VhtYJwyPcR1GWz0SbS9hw",
    authDomain: "social-bunch-app.firebaseapp.com",
    projectId: "social-bunch-app",
    storageBucket: "social-bunch-app.appspot.com",
    messagingSenderId: "26239972230",
    appId: "1:26239972230:web:5a47ba8023c9fdc10f3207",
    measurementId: "G-H8DGM9R2TC"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
} else {
    firebase.app(); 
}

export const storage = firebase.storage();
export const database = firebase.database();
export const auth = firebase.auth();
firebase.firestore();
export const f = firebase;
