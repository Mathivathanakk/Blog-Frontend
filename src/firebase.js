// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "bloggy-blog-21ee8.firebaseapp.com",
  projectId: "bloggy-blog-21ee8",
  storageBucket: "bloggy-blog-21ee8.appspot.com",
  messagingSenderId: "277582940637",
  appId: "1:277582940637:web:d1d01b8e9a2a071d460e34"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);