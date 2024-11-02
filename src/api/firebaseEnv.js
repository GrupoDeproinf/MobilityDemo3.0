import firestore from 'firebase/compat/firestore'
import { getStorage } from "firebase/storage";
import firebase from "firebase/compat/app";
import "firebase/compat/storage";
import "firebase/compat/auth";

const app = firebase.initializeApp({
    apiKey: "AIzaSyB-5mOZVA3E3b8NrwyUbbk9x_UZ9Ux0CiU",
    authDomain: "testapi-16c41.firebaseapp.com",
    projectId: "testapi-16c41",
    storageBucket: "testapi-16c41.appspot.com",
    messagingSenderId: "307399143194",
    appId: "1:307399143194:web:c2100cc35ffe0f6875c6a3",
    measurementId: "G-ZT7EHJ2MQQ"
});

const fire = firebase.firestore();
const storage = getStorage(app);

export { app, fire, storage }; 