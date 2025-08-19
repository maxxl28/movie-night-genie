/*
Author: Max Liu
Email: maximilian.b.liu.28@dartmouth.edu
Purpose: Initialize Firebase and export auth instance for use in the application
*/

import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserSessionPersistence } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBehMqLkXuQxrW_LW-0MdN-1R_stv3paQQ",
  authDomain: "movie-night-genie-e5bab.firebaseapp.com",
  projectId: "movie-night-genie-e5bab",
  storageBucket: "movie-night-genie-e5bab.firebasestorage.app",
  messagingSenderId: "592202392091",
  appId: "1:592202392091:web:b32b81ae3e46835eb24ebe",
  measurementId: "G-W358RL3N5R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
setPersistence(auth, browserSessionPersistence); 

export { app, auth };