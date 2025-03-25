import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar, Nav, Dropdown } from "react-bootstrap"; // Import Dropdown
import { Link, useNavigate } from "react-router-dom";
import { auth } from "./firebase"; // Adjust path if needed
import { signOut, onAuthStateChanged } from "firebase/auth";
import "./navbar.css";

const MainNavbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("Logout successful");
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // Function to remove focus after click
  const handleNavClick = (e) => {
    e.target.blur();
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="main-navbar sticky-top">
      <div className="container-fluid">
        <Navbar.Brand as={Link} to="/">
          <img src="../hhbot.svg" alt="hhbot" className="profile-img" />
          Harvest Hub
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#home" onClick={handleNavClick}>Home</Nav.Link>
            <Nav.Link href="#homeIntroduction" onClick={handleNavClick}>About</Nav.Link>
            <Nav.Link href="#services" onClick={handleNavClick}>Services</Nav.Link>
            <Nav.Link href="#homeVideoSection" onClick={handleNavClick}>Agriculture Matters</Nav.Link>
            <Nav.Link href="#reasons" onClick={handleNavClick}>Why Choose Us</Nav.Link>
          </Nav>
          <Nav>
            {user ? (
              <Dropdown align="end" className="mx-3">
                <Dropdown.Toggle
                  as={Nav.Link}
                  className="profile-dropdown p-0"
                  variant="link"
                >
                  <img
                    src="../hhbot.svg"
                    alt="Profile"
                    className="profile-img"
                  />
                </Dropdown.Toggle>

                <Dropdown.Menu className="mt-2">
                  <Dropdown.Item href="#profile">Profile</Dropdown.Item>
                  <Dropdown.Item href="/dashboard">Dashboard</Dropdown.Item>
                  <Dropdown.Item href="/dashboard/settings">Settings</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <Nav.Link as={Link} to="/login" className="ms-auto" onClick={handleNavClick}>
                Login/Signup
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
};

export default MainNavbar;