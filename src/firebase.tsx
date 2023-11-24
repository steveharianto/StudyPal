// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "@firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCb2rDoavmx2lcOQrdpM6A6ihnHMNL5-FQ",
  authDomain: "studypal-cf71b.firebaseapp.com",
  projectId: "studypal-cf71b",
  storageBucket: "studypal-cf71b.appspot.com",
  messagingSenderId: "843692009278",
  appId: "1:843692009278:web:9657d34ff3927e24c1ae6f",
  measurementId: "G-GX6DWJ3BZK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export default db;