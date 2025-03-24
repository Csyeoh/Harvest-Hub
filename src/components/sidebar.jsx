// Sidebar.jsx
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar-container">
      <Navbar 
        bg="dark" 
        variant="dark" 
        className="flex-column h-100 sidebar"
      >
        <Navbar.Brand as={Link} to="/" className="mb-4">
          <img src="../hhbot.svg" alt="hhbot" className="profile-img"/>
          Harvest Hub
        </Navbar.Brand>

        <Nav className="flex-column w-100">
          <NavDropdown 
            title={
              <span>
                <i className="bi bi-flower1 me-2"></i>
                Plant Profile
              </span>
            }
            id="plant-profile-dropdown"
            className="mb-2 plant-profile-dropdown"
          >
            <NavDropdown.Item href="#plants/flowers">Flowers</NavDropdown.Item>
            <NavDropdown.Item href="#plants/vegetables">Vegetables</NavDropdown.Item>
            <NavDropdown.Item href="#plants/trees">Trees</NavDropdown.Item>
            <NavDropdown.Item href="#plants/crops">Crops</NavDropdown.Item>
          </NavDropdown>
          
          <NavLink to="/dashboard" className="nav-link mb-2" end>
            <i className="bi bi-house-door-fill me-2"></i>
            Dashboard
          </NavLink>
          <NavLink to="/dashboard/crop-cultivation" className="nav-link mb-2">
            <i className="bi bi-search me-2"></i>
            Crop Cultivation
          </NavLink>
          <NavLink to="/dashboard/calendar" className="nav-link mb-2">
            <i className="bi bi-calendar3 me-2"></i>
            Calendar
          </NavLink>
          <NavLink to="/dashboard/chat" className="nav-link mb-2">
            <i className="bi bi-chat-dots me-2"></i>
            Chat Assistant
          </NavLink>
          <NavLink to="/dashboard/farm-report" className="nav-link mb-2">
            <i className="bi bi-clipboard-data me-2"></i>
            Farm Report
          </NavLink>
          <NavLink to="/dashboard/settings" className="nav-link mt-auto">
            <i className="bi bi-gear me-2"></i>
            Settings
          </NavLink>
        </Nav>
      </Navbar>
    </div>
  );
};

export default Sidebar;