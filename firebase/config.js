// firebase/config.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";
import { getFunctions } from "firebase/functions";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAuk2WyU_1zNyOXgmMvJPdCg2m3efB8pDA",
  authDomain: "insightful-ai-b3hca.firebaseapp.com",
  projectId: "insightful-ai-b3hca",
  storageBucket: "insightful-ai-b3hca.firebasestorage.app",
  messagingSenderId: "447817630779",
  appId: "1:447817630779:web:ec45b0ae03a189d324881e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const functions = getFunctions(app);
let analytics;

// Initialize analytics only in client-side
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { app, auth, db, storage, functions, analytics };
