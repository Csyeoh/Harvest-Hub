import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          {/* About Column */}
          <div className="col-md-3">
            <h3 className="footer-logo">CropWise</h3>
            <p>
              CropWise is an AI-enhanced crop management system, empowering small-scale farmers with sustainable solutions.
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
              <li><a href="/about">About</a></li>
              <li><a href="/services">Services</a></li>
              <li><a href="/projects">Our Projects</a></li>
              <li><a href="/farmers">Meet the Farmers</a></li>
              <li><a href="/news">Latest News</a></li>
              <li><a href="/contact">Contact</a></li>
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
          <div className="col-md-4">
            <h4>Contact</h4>
            <ul className="footer-contact">
              <li>
                <i className="fas fa-phone-alt"></i> +666 888 0000
              </li>
              <li>
                <i className="fas fa-envelope"></i> needhelp@cropwise.com
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
              <p>© All Copyright 2025 by CropWise</p>
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