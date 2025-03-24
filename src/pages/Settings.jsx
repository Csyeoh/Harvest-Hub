import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoPersonOutline, IoMailOutline, IoLockClosedOutline, IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import "./Signup.css"; // Import styles with signup prefix

const Signup = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = (e) => {
    e.preventDefault();
    // Basic validation
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    // Add signup logic here (e.g., API call)
    console.log("Signup attempted with:", { username, email, password });
    // Navigate to login or dashboard after signup
    navigate("/login");
  };

  return (
    <div className="signupContainer">
      <img src="https://via.placeholder.com/150" alt="CropWise Logo" className="signupLogo" />
      <h2 className="signupTitle">Sign Up for CropWise</h2>

      <div className="signupInputContainer">
        <IoPersonOutline size={20} color="#888" className="signupIcon" />
        <input
          className="signupInput"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      <div className="signupInputContainer">
        <IoMailOutline size={20} color="#888" className="signupIcon" />
        <input
          className="signupInput"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="signupInputContainer">
        <IoLockClosedOutline size={20} color="#888" className="signupIcon" />
        <input
          className="signupInput"
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div className="signupInputContainer">
        <IoLockClosedOutline size={20} color="#888" className="signupIcon" />
        <input
          className="signupInput"
          type={showPassword ? "text" : "password"}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button onClick={() => setShowPassword(!showPassword)} className="signupIconButton">
          {showPassword ? <IoEyeOffOutline size={20} color="#888" /> : <IoEyeOutline size={20} color="#888" />}
        </button>
      </div>

      <button className="signupSignupButton" onClick={handleSignup}>
        Sign Up
      </button>

      <p className="signupLoginText" onClick={() => navigate("/login")}>
        Already have an account? Login
      </p>
    </div>
  );
};

export default Signup;