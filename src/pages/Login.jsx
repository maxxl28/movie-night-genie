/*
Author: Max Liu
Email: maximilian.b.liu.28@dartmouth.edu
Purpose: Allow users to log in and sign up
*/

import { useState } from "react";
import { 
  GoogleAuthProvider, 
  signInWithEmailAndPassword, 
  signInWithPopup,
  createUserWithEmailAndPassword
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { registerUser } from "../services/userService"; 

export default function Login() {
  // State for form data and errors
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Toggle between login and sign up modes
  const toggleSignUp = () => {
    setIsSignUp(!isSignUp);
    setError("");
    setConfirmPassword("");
  };

  // Handle successful authentication
  const handleAuthSuccess = async (user) => {
    try {
      // Register user in PostgreSQL database
      await registerUser(user.uid, user.email);
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Failed to sync user with backend:", err);
      setError("Login successful but failed to initialize user profile. Please refresh.");
    }
  };

  // Handle email/password login
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await handleAuthSuccess(userCredential.user);
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle email/password sign up
  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    
    // Validate password confirmation
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    // Validate password length
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await handleAuthSuccess(userCredential.user);
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle Google authentication
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
    <div className="login-container">
      {/* Login/Sign up form */}
      <form onSubmit={isSignUp ? handleEmailSignUp : handleEmailLogin}>
        <h3>{isSignUp ? "Create Account" : "Login"}</h3>
        {/* Display errors if any */}
        {error && <div className="error">{error}</div>}
        
        {/* Email input */}
        <label>
          Email:
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        
        {/* Password input */}
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </label>

        {/* Confirm password input (only shown for sign up) */}
        {isSignUp && (
          <label>
            Confirm Password:
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
            />
          </label>
        )}

        {/* Submit button */}
        <button type="submit">
          {isSignUp ? "Create Account" : "Login with Email"}
        </button>
      </form>
      
      {/* Google authentication option */}
      <div className="google-login">
        <p>Or</p>
        <button onClick={handleGoogleLogin}>
          Sign {isSignUp ? "up" : "in"} with Google
        </button>
      </div>

      {/* Toggle between login and sign up */}
      <div className="auth-switch">
        {isSignUp ? "Already have an account? " : "Don't have an account? "}
        <button type="button" onClick={toggleSignUp} className="link-button">
          {isSignUp ? "Log in" : "Sign up"}
        </button>
      </div>
    </div>
  );
}