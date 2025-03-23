import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Use navigate for web
import { IoMailOutline, IoLockClosedOutline, IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import "./Login.css"; // Import styles

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="container">
      <img src="https://via.placeholder.com/150" alt="Logo" className="logo" />
      <h2 className="title">Welcome to Harvest Hub</h2>

      <div className="inputContainer">
        <IoMailOutline size={20} color="#888" className="icon" />
        <input
          className="input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="inputContainer">
        <IoLockClosedOutline size={20} color="#888" className="icon" />
        <input
          className="input"
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={() => setShowPassword(!showPassword)} className="iconButton">
          {showPassword ? <IoEyeOffOutline size={20} color="#888" /> : <IoEyeOutline size={20} color="#888" />}
        </button>
      </div>

      <button className="loginButton">Login</button>

      <p className="signupText" onClick={() => navigate("/signup")}>
        Don't have an account? Sign up
      </p>
    </div>
  );
};

export default Login;
