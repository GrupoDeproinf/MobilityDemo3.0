// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyB-5mOZVA3E3b8NrwyUbbk9x_UZ9Ux0CiU",
	authDomain: "testapi-16c41.firebaseapp.com",
	projectId: "testapi-16c41",
	storageBucket: "testapi-16c41.appspot.com",
	messagingSenderId: "307399143194",
	appId: "1:307399143194:web:c2100cc35ffe0f6875c6a3",
	measurementId: "G-ZT7EHJ2MQQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export default app;