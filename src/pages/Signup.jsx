import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoPersonOutline, IoMailOutline, IoLockClosedOutline, IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { auth } from "../components/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore"; // Import Firestore
import "bootstrap/dist/css/bootstrap.min.css";
import "./Signup.css";

// Initialize Firestore
const db = getFirestore();

const Signup = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update the user's profile with the username
      await updateProfile(user, {
        displayName: username,
      });

      // Save additional user data (like location) to Firestore
      await setDoc(doc(db, "users", user.uid), {
        username: username,
        email: email,
        location: "", // Initialize location as empty
      });

      console.log("Signup successful with:", { username, email });
      navigate("/login");
    } catch (err) {
      setError(err.message);
      console.error("Signup failed:", err);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-background"></div>
      <a href="/">
        <img src="../hhbot.svg" alt="hhbot" className="logsign-img" />
      </a>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-4 auth-form">
            <h2 className="auth-title">Sign Up for Harvest Hub</h2>

            {error && <p className="auth-errorText">{error}</p>}

            <div className="auth-inputContainer">
              <IoPersonOutline size={20} color="#888" className="auth-icon" />
              <input
                className="auth-input"
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="auth-inputContainer">
              <IoMailOutline size={20} color="#888" className="auth-icon" />
              <input
                className="auth-input"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="auth-inputContainer">
              <IoLockClosedOutline size={20} color="#888" className="auth-icon" />
              <input
                className="auth-input"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="auth-inputContainer">
              <IoLockClosedOutline size={20} color="#888" className="auth-icon" />
              <input
                className="auth-input"
                type={showPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button onClick={() => setShowPassword(!showPassword)} className="auth-iconButton">
                {showPassword ? <IoEyeOffOutline size={20} color="#888" /> : <IoEyeOutline size={20} color="#888" />}
              </button>
            </div>

            <button className="auth-actionButton" onClick={handleSignup}>
              Sign Up
            </button>

            <p className="auth-navText" onClick={() => navigate("/login")}>
              Already have an account? Login
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;