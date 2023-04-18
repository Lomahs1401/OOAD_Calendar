// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCd8AkXlxxmNyLnjJYcSJ85KAhHQ5FH2bQ",
    authDomain: "calendarapp-31349.firebaseapp.com",
    projectId: "calendarapp-31349",
    storageBucket: "calendarapp-31349.appspot.com",
    messagingSenderId: "325097874801",
    appId: "1:325097874801:web:7ae57375dc407c023142d0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Firestore to get a reference to the service
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db }

