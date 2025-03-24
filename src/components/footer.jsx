import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          {/* About Column */}
          <div className="col-md-4">
            <h3 className="footer-logo">Harvest Hub</h3>
            <p>
              Harvest Hub empowers small-scale farmers with AI-driven tools to double yields sustainably, offering crop insights, smart irrigation, harvest predictions, and market trend tracking.
            </p>
            <div className="social-icons">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-pinterest"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>

          {/* Explore Column */}
          <div className="col-md-2">
            <h4>Explore</h4>
            <ul className="footer-links">
              <li><a href="#home">Home</a></li>
              <li><a href="#homeIntroduction">About</a></li>
              <li><a href="#services">Services</a></li>
              <li><a href="#homeVideoSection">Agriculture Matters</a></li>
              <li><a href="#reasons">Why Choose Us</a></li>
            </ul>
          </div>

          {/* News Column */}
          <div className="col-md-3">
            <h4>News</h4>
            <ul className="footer-news">
              <li>
                <a href="#">Bringing Food Production Back To Cities</a>
                <span>July 5, 2022</span>
              </li>
              <li>
                <a href="#">The Future of Farming, Smart Irrigation Solutions</a>
                <span>July 5, 2022</span>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className="col-md-3">
            <h4>Contact</h4>
            <ul className="footer-contact">
              <li>
                <i className="fas fa-phone-alt"></i> +666 888 0000
              </li>
              <li>
                <i className="fas fa-envelope"></i> needhelp@harvesthub.com
              </li>
              <li>
                <i className="fas fa-map-marker-alt"></i> 80 Brooklyn Golden Street Line, New York, USA
              </li>
            </ul>
            <div className="newsletter">
              <input type="email" placeholder="Your Email Address" />
              <button className="btn btn-success">
                <i className="fas fa-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="footer-bottom">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <p>© All Copyright 2025 by Harvest Hub</p>
            </div>
            <div className="col-md-6 text-md-end">
              <a href="/terms">Terms of Use</a>
              <span> | </span>
              <a href="/privacy">Privacy Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;