// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserSessionPersistence } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
setPersistence(auth, browserSessionPersistence); // (Comment: Moved after auth is initialized)

export { app, auth };