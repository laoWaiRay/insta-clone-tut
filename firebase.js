// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBP8KZhdX5OKZhHl9wFjX0OWs7vYmnEnGk",
  authDomain: "instagram-tut-3c412.firebaseapp.com",
  projectId: "instagram-tut-3c412",
  storageBucket: "instagram-tut-3c412.appspot.com",
  messagingSenderId: "484642820702",
  appId: "1:484642820702:web:dea2510338d199fe681acf"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();
const storage = getStorage();

export { app, db, storage }