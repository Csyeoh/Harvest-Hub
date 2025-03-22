// Sidebar.jsx
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Nav, Navbar, NavDropdown } from 'react-bootstrap';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar-container">
      <Navbar 
        bg="dark" 
        variant="dark" 
        className="flex-column h-100 sidebar"
      >
        <Navbar.Brand href="#" className="mb-4">
          <i className="bi bi-tree-fill me-2"></i>
          Agri Dashboard
        </Navbar.Brand>

        <Nav className="flex-column w-100">
          {/* Plant Profile Dropdown */}
          <NavDropdown 
            title={
              <span>
                <i className="bi bi-flower1 me-2"></i>
                Plant Profile
              </span>
            }
            id="plant-profile-dropdown"
            className="mb-2"
          >
            <NavDropdown.Item href="#plants/flowers">Flowers</NavDropdown.Item>
            <NavDropdown.Item href="#plants/vegetables">Vegetables</NavDropdown.Item>
            <NavDropdown.Item href="#plants/trees">Trees</NavDropdown.Item>
            <NavDropdown.Item href="#plants/crops">Crops</NavDropdown.Item>
          </NavDropdown>

          {/* Crop Cultivation */}
          <Nav.Link href="#crop-cultivation" className="mb-2">
            <i className="bi bi-grain me-2"></i>
            Crop Cultivation
          </Nav.Link>

          {/* Calendar */}
          <Nav.Link href="#calendar" className="mb-2">
            <i className="bi bi-calendar3 me-2"></i>
            Calendar
          </Nav.Link>

          {/* Chat Assistant */}
          <Nav.Link href="#chat" className="mb-2">
            <i className="bi bi-chat-dots me-2"></i>
            Chat Assistant
          </Nav.Link>

          {/* Farm Report */}
          <Nav.Link href="#farm-report" className="mb-2">
            <i className="bi bi-clipboard-data me-2"></i>
            Farm Report
          </Nav.Link>

          {/* Settings - Fixed at bottom */}
          <Nav.Link href="#settings" className="mt-auto">
            <i className="bi bi-gear me-2"></i>
            Settings
          </Nav.Link>
        </Nav>
      </Navbar>
    </div>
  );
};

export default Sidebar;