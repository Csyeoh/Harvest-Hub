import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoMailOutline, IoLockClosedOutline, IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { auth } from "../components/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Login successful");
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="auth-container">
      <img src="https://via.placeholder.com/150" alt="Harvest Hub Logo" className="auth-logo" />
      <h2 className="auth-title">Login to Harvest Hub</h2>

      {error && <p className="auth-errorText">{error}</p>}

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
        <button onClick={() => setShowPassword(!showPassword)} className="auth-iconButton">
          {showPassword ? <IoEyeOffOutline size={20} color="#888" /> : <IoEyeOutline size={20} color="#888" />}
        </button>
      </div>

      <button className="auth-actionButton" onClick={handleLogin}>
        Login
      </button>

      <p className="auth-navText" onClick={() => navigate("/signup")}>
        Don't have an account? Sign Up
      </p>
    </div>
  );
};

export default Login;