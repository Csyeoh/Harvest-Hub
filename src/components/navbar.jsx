// MainNavbar.jsx
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './navbar.css';

const MainNavbar = () => {
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
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#homeIntroduction">About</Nav.Link>
            <Nav.Link href="#services">Services</Nav.Link>
            <Nav.Link href="#homeVideoSection">Agriculture Matters</Nav.Link>
            <Nav.Link href="#reasons">Why Choose Us</Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link as={Link} to="/login" className="ms-auto">
              Login/Signup
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
};

export default MainNavbar;