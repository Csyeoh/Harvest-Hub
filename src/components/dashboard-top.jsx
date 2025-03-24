// TopNavbar.jsx
import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav, Form, FormControl, Dropdown } from 'react-bootstrap';
import { Link, useNavigate } from "react-router-dom";
import { auth } from "./firebase"; // Adjust path if needed
import { signOut} from "firebase/auth";
import './dashboard-top.css';

const TopNavbar = () => {
  const navigate = useNavigate();

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
  return (
    <Navbar bg="dark" variant="dark" fixed="top" className="top-navbar">
      <div className="container-fluid justify-content-center">
        {/* Empty space on left to account for sidebar */}
        <div style={{ width: '250px' }}></div>

        {/* Search Bar */}
        <Form className="d-flex mx-auto search-form">
          <FormControl
            type="search"
            placeholder="Search farm data..."
            className="me-2"
            aria-label="Search"
          />
        </Form>

        {/* Right Side Icons */}
        <Nav className="ms-auto align-items-center">
          {/* Notification Bell with Dropdown */}
          <Dropdown className="mx-3 notification-dropdown">
            <Dropdown.Toggle 
              as={Nav.Link} 
              className="p-0 notification-toggle"
              variant="link"
            >
              <i className="bi bi-bell"></i>
              <span className="badge rounded-pill bg-danger notification-badge">
                3
                <span className="visually-hidden">unread notifications</span>
              </span>
            </Dropdown.Toggle>

            <Dropdown.Menu align="end" className="mt-2 notification-menu">
              <Dropdown.ItemText>Notification History</Dropdown.ItemText>
              <Dropdown.Divider />
              <Dropdown.Item href="#notification1">
                Irrigation system alert - 10:30 AM
              </Dropdown.Item>
              <Dropdown.Item href="#notification2">
                Weather warning - 9:15 AM
              </Dropdown.Item>
              <Dropdown.Item href="#notification3">
                Harvest reminder - Yesterday
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          {/* Profile Dropdown with Image */}
          <Dropdown align="end" className="mx-3">
            <Dropdown.Toggle 
              as={Nav.Link} 
              className="profile-dropdown p-0"
              variant="link"
            >
              <img 
                src='../hhbot.svg'
                alt="Profile" 
                className="profile-img"
              />
            </Dropdown.Toggle>

            <Dropdown.Menu className="mt-2">
              <Dropdown.Item href="#profile">Profile</Dropdown.Item>
              <Dropdown.Item href="/dashboard/settings">Settings</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Nav>
      </div>
    </Navbar>
  );
};

export default TopNavbar;