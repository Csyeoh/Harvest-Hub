import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoPersonOutline, IoMailOutline, IoLockClosedOutline, IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import "./Signup.css"; // Import styles

const Signup = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="container">
      <img src="https://via.placeholder.com/150" alt="Logo" className="logo" />
      <h2 className="title">Create an Account</h2>

      <div className="inputContainer">
        <IoPersonOutline size={20} color="#888" className="icon" />
        <input
          className="input"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

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
      </div>

      <div className="inputContainer">
        <IoLockClosedOutline size={20} color="#888" className="icon" />
        <input
          className="input"
          type={showPassword ? "text" : "password"}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button onClick={() => setShowPassword(!showPassword)} className="iconButton">
          {showPassword ? <IoEyeOffOutline size={20} color="#888" /> : <IoEyeOutline size={20} color="#888" />}
        </button>
      </div>

      <button className="signupButton">Sign Up</button>

      <p className="loginText" onClick={() => navigate("/login")}>
        Already have an account? Login
      </p>
    </div>
  );
};

export default Signup;
