/*
Author: Max Liu
Email: maximilian.b.liu.28@dartmouth.edu
Purpose: Log in page (supports Google and email)
*/

import { useState } from "react";
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { registerUser } from "../api/users"; 

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Common success handler for both login methods
  const handleAuthSuccess = async (user) => {
    try {
      // Register/update user in your PostgreSQL database
      await registerUser(user.uid, user.email);
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Failed to sync user with backend:", err);
      setError("Login successful but failed to initialize user profile. Please refresh.");
    }
  };

  // Email/Password Login
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await handleAuthSuccess(userCredential.user);
    } catch (err) {
      setError(err.message);
    }
  };

  // Google Login
  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      await handleAuthSuccess(userCredential.user);
    } catch (err) {
      setError("Google login failed: " + err.message);
    }
  };

  return (
    <div className="login">
      <form onSubmit={handleEmailLogin}>
        <h3>Login</h3>
        {error && <div className="error">{error}</div>}
        
        <label>
          Email:
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit">Login with Email</button>
      </form>
      
      <div className="google-login">
        <p>Or</p>
        <button onClick={handleGoogleLogin}>
          Sign in with Google
        </button>
      </div>
    </div>
  );
}