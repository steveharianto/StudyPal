// Import the necessary functions from the modular SDK
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCb2rDoavmx2lcOQrdpM6A6ihnHMNL5-FQ",
  authDomain: "studypal-cf71b.firebaseapp.com",
  projectId: "studypal-cf71b",
  storageBucket: "studypal-cf71b.appspot.com",
  messagingSenderId: "843692009278",
  appId: "1:843692009278:web:9657d34ff3927e24c1ae6f",
  measurementId: "G-GX6DWJ3BZK",
};

// Initialize the Firebase app
const app = initializeApp(firebaseConfig);

// Get the Firestore instance
const firestore = getFirestore(app);

// Export the Firestore instance and the Firebase app
export { firestore, app as firebase };
