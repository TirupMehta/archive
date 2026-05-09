import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAVxEpOBeu6iLU3o5U7MSqT68C0cAeYXYY",
  authDomain: "archive-your-text.firebaseapp.com",
  projectId: "archive-your-text",
  storageBucket: "archive-your-text.firebasestorage.app",
  messagingSenderId: "666428711347",
  appId: "1:666428711347:web:515f64facaa693549babc6",
  measurementId: "G-6ZXRR9LGKH"
};

export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);

export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
