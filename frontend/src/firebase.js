import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDvCLus64w5phUP-6WHpuPlTFo7ogaE2j0",
  authDomain: "trading-1bdbc.firebaseapp.com",
  projectId: "trading-1bdbc",
  storageBucket: "trading-1bdbc.appspot.com",
  messagingSenderId: "949635385003",
  appId: "1:949635385003:web:37ef4f9195116c474b99ee",
  measurementId: "G-H4Y95CGH0F"
};

// Initializing Firebase
const app = initializeApp(firebaseConfig);

// ✅ Exporting Firebase services used throughout app
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
