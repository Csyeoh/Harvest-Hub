import React from 'react';
import './Home.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const Home = () => {
  return (
    <div className="Home">
      {/* Hero Section */}
      <section id="home" className="homeHero text-center text-white d-flex align-items-center justify-content-center">
        <div>
          <p className="homeWelcomeText">Welcome to Harvest Hub!</p>
          <h1 className="homeHeroTitle">
            Double Your Yield, <span className="homeHighlight">Sustainably</span>
          </h1>
          <p className="homeHeroDescription">
            Empowering farmers with accessible, scalable AI tools to boost productivity and income while nurturing the planet.
          </p>
          <button className="btn btn-success">Start Farming Smarter</button>
        </div>
      </section>

      {/* Features Section */}
      <section className="features py-5">
        <div className="container">
          <div className="row">
            <div className="col-md-4">
              <div className="homeFeatureCard p-4 text-center">
                <h4 className="homeFeatureTitle">AI-Powered Crop Insights</h4>
                <h3>Analyze satellite imagery, weather data (rainfall, temperature, humidity), and soil sensors to monitor crop health and predict risks like pests or poor yields.</h3>
                <img src="/assets/feature1.png" alt="Feature 1" className="img-fluid rounded" />
              </div>
            </div>
            <div className="col-md-4">
              <div className="homeFeatureCard p-4 text-center">
                <h4 className="homeFeatureTitle">Smart Irrigation & Alerts</h4>
                <h3>Get data-driven irrigation recommendations and SMS alerts to optimize water use and reduce fertilizer overuse—works offline too!</h3>
                <img src="/assets/feature2.jpg" alt="Feature 2" className="img-fluid rounded" />
              </div>
            </div>
            <div className="col-md-4">
              <div className="homeFeatureCard p-4 text-center">
                <h4 className="homeFeatureTitle">Farm Success Companion</h4>
                <h3>Chat with our AI assistant for real-time advice, predict your next harvest with precision, and track daily price trends to maximize profits.</h3>
                <img src="/assets/feature3.jpg" alt="Feature 3" className="img-fluid rounded" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section id="homeIntroduction" className="homeIntroduction py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <div className="homeImageStack">
                <img src="/assets/homeIntroLarge.jpg" alt="Large Farm" className="img-fluid homeLargeImage" />
                <img src="/assets/homeIntroSmall.jpg" alt="Small Farm" className="img-fluid homeSmallImage" />
              </div>
            </div>
            <div className="col-md-6">
              <h4 className="homeSectionSubtitle">Our Introduction</h4>
              <h2>AI-Enhanced Crop Management System</h2>
              <p><span className="homeSectionHighlight">Farming Forward with Harvest Hub.</span></p>
              <p>
                Harvest Hub uses advanced AI to analyze satellite imagery, weather data, and soil sensors, helping small-scale farmers double their productivity sustainably.
              </p>
              <ul className="list-unstyled">
                <li className="d-flex align-items-center mb-2">
                  <span className="homeIcon me-2">🌍</span> Monitor crop health with AI
                </li>
                <li className="d-flex align-items-center mb-2">
                  <span className="homeIcon me-2">💧</span> Optimize irrigation with smart alerts
                </li>
                <li className="d-flex align-items-center">
                  <span className="homeIcon me-2">🤖</span> Chat, Predict, Profit
                </li>
              </ul>
              <button className="btn btn-success">Discover More</button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="services py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-5">What We Offer</h2>
          <div className="row">
            <div className="col-md-3">
              <div className="homeServiceCard text-center">
                <img src="/assets/service1.png" alt="Crop Insights" className="img-fluid rounded" />
                <h3>AI Crop Insights</h3>
                <p>Monitor crop health with AI, analyzing satellite imagery and soil data to predict risks.</p>
                <button className="btn btn-success">Read More</button>
              </div>
            </div>
            <div className="col-md-3">
              <div className="homeServiceCard text-center">
                <img src="/assets/service2.jpg" alt="Smart Irrigation" className="img-fluid rounded" />
                <h3>Smart Irrigation</h3>
                <p>Optimize water use with data-driven recommendations and notification alerts.</p>
                <button className="btn btn-success">Read More</button>
              </div>
            </div>
            <div className="col-md-3">
              <div className="homeServiceCard text-center">
                <img src="/assets/service3.jpeg" alt="Harvest Prediction" className="img-fluid rounded" />
                <h3>Harvest Prediction</h3>
                <p>Predict your next harvest with precision using our AI-powered companion.</p>
                <button className="btn btn-success">Read More</button>
              </div>
            </div>
            <div className="col-md-3">
              <div className="homeServiceCard text-center">
                <img src="/assets/service4.jpg" alt="Market Trends" className="img-fluid rounded" />
                <h3>Market Trends</h3>
                <p>Track daily price trends to maximize profits with real-time AI advice.</p>
                <button className="btn btn-success">Read More</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section id="homeVideoSection" className="homeVideoSection py-5 text-white text-center">
        <h1>Agriculture Matters to the Future of Development</h1>
        <div className="homeVideoContainer">
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/xFqecEtdGZ0"
            title="Agriculture Matters Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </section>

      {/* Reasons Section */}
      <section id="reasons" className="reasons py-5">
        <div className="container">
          <div className="row align-items-center equal-height-row">
            <div className="col-md-6 image-col">
              <img src="/assets/reasons.jpg" alt="Reasons" className="img-fluid rounded" />
            </div>
            <div className="col-md-6 text-col">
              <h2>Why Choose Harvest Hub</h2>
              <p>
                Harvest Hub empowers small-scale farmers with AI tools to double yields, boost income, and farm sustainably.
              </p>
              <ul className="list-unstyled">
                <li className="d-flex align-items-center mb-3">
                  <span className="homeCheckIcon me-2">✔</span> AI-Powered Crop Insights
                </li>
                <li className="d-flex align-items-center mb-3">
                  <span className="homeCheckIcon me-2">✔</span> Smart Irrigation Alerts
                </li>
                <li className="d-flex align-items-center mb-3">
                  <span className="homeCheckIcon me-2">✔</span> Harvest & Market Predictions
                </li>
                <li className="d-flex align-items-center">
                  <span className="homeCheckIcon me-2">✔</span> Sustainable Farming
                </li>
              </ul>
              <button className="btn btn-success discover-more-btn">Discover More</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;