import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoMailOutline, IoLockClosedOutline, IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import "./Login.css"; // Import styles with login prefix

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    // Add login logic here (e.g., API call)
    console.log("Login attempted with:", { email, password });
    // Navigate to dashboard after login
    navigate("/dashboard");
  };

  return (
    <div className="loginContainer">
      <img src="https://via.placeholder.com/150" alt="CropWise Logo" className="loginLogo" />
      <h2 className="loginTitle">Login to CropWise</h2>

      <div className="loginInputContainer">
        <IoMailOutline size={20} color="#888" className="loginIcon" />
        <input
          className="loginInput"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="loginInputContainer">
        <IoLockClosedOutline size={20} color="#888" className="loginIcon" />
        <input
          className="loginInput"
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={() => setShowPassword(!showPassword)} className="loginIconButton">
          {showPassword ? <IoEyeOffOutline size={20} color="#888" /> : <IoEyeOutline size={20} color="#888" />}
        </button>
      </div>

      <button className="loginLoginButton" onClick={handleLogin}>
        Login
      </button>

      <p className="loginSignupText" onClick={() => navigate("/signup")}>
        Don't have an account? Sign Up
      </p>
    </div>
  );
};

export default Login;