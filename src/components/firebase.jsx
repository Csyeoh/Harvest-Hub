import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Import Firestore

// Your Firebase configuration object (get this from Firebase Console)
const firebaseConfig = {
  apiKey: "AIzaSyBPLj25DHmA7HcopTlrTr4lqxuOHejsqoI",
  authDomain: "harvest-hub-fe967.firebaseapp.com",
  projectId: "harvest-hub-fe967",
  storageBucket: "harvest-hub-fe967.firebasestorage.app",
  messagingSenderId: "71908262958",
  appId: "1:71908262958:web:897a28def50aabf4b0cbbf",
  measurementId: "G-QH9Y5GBG00"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // Initialize Firestore

export { auth, db }; // Export both auth and db