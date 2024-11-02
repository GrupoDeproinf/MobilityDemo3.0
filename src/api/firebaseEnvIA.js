import firestore from 'firebase/compat/firestore'
import { getStorage } from "firebase/storage";
import firebase from "firebase/compat/app";
import "firebase/compat/storage";
import "firebase/compat/auth";
import { getFunctions, httpsCallable } from 'firebase/functions';

const firebaseConfig2 = {
    apiKey: "AIzaSyAyOP6k4yqqnFJlIlhMJOzETOnO95tCtyo",
    authDomain: "ia---models.firebaseapp.com",
    projectId: "ia---models",
    storageBucket: "ia---models.appspot.com",
    messagingSenderId: "419230101055",
    appId: "1:419230101055:web:b1d67384774cd54c99d28a"
};

const app2 = firebase.initializeApp(firebaseConfig2, "app2");

const fire2 = firebase.firestore();
const storage2 = getStorage(app2);
const functions2 = getFunctions(app2);
const getOpenAIResponse = httpsCallable(functions2, 'getOpenAIResponse');

export { app2, fire2, storage2, getOpenAIResponse }; 