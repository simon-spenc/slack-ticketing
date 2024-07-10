// src/firebase.js
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAQcn-suHRuBmjWk13jC87pxPVs1J3jqjs",
  authDomain: "slack-ticketing-app.firebaseapp.com",
  projectId: "slack-ticketing-app",
  storageBucket: "slack-ticketing-app.appspot.com",
  messagingSenderId: "139137563196",
  appId: "1:139137563196:web:0a2a3e2eafa0c99a4e2139",
  measurementId: "G-2PBKMYY1KM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
const analytics = getAnalytics(app);

export { auth };