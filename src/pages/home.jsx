import React from 'react';
import './home.css';

const Home = () => {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero text-center text-white d-flex align-items-center justify-content-center">
        <div>
          <p className="welcome-text">Welcome to CropWise!</p>
          <h1 className="hero-title">
            Double Your Yield, <span className="highlight">Sustainably</span>
          </h1>
          <p className="hero-description">
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
              <div className="feature-card p-4 text-center">
                <h4 className="feature-title">AI-Powered Crop Insights</h4>
                <h3>Analyze satellite imagery, weather data (rainfall, temperature, humidity), and soil sensors to monitor crop health and predict risks like pests or poor yields.</h3>
                <img src="/assets/feature1.png" alt="Feature 1" className="img-fluid rounded" />
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-card p-4 text-center">
                <h4 className="feature-title">Smart Irrigation & Alerts</h4>
                <h3>Get data-driven irrigation recommendations and SMS alerts to optimize water use and reduce fertilizer overuse—works offline too!</h3>
                <img src="/assets/feature2.jpg" alt="Feature 2" className="img-fluid rounded" />
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-card p-4 text-center">
                <h4 className="feature-title">Sustainable Growth Strategies</h4>
                <h3>Explore AI-driven crop rotation plans to improve soil health, increase biodiversity, and double your productivity sustainably.</h3>
                <img src="/assets/feature3.jpeg" alt="Feature 3" className="img-fluid rounded" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="introduction py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <div className="image-stack">
                <img src="/assets/homeIntroLarge.jpg" alt="Large Farm" className="img-fluid large-image rounded" />
                <img src="/assets/homeIntroSmall.png" alt="Small Farm" className="img-fluid small-image rounded" />
              </div>
            </div>
            <div className="col-md-6">
              <h4 className="section-subtitle">Our Introduction</h4>
              <h2>AI-Enhanced Crop Management System</h2>
              <p>Farming Forward with CropWise.</p>
              <p>
                There are many variations of passages of lorem ipsum available but the majority have suffered alteration in some form by injected humor or random word which don't look even.
              </p>
              <ul className="list-unstyled">
                <li className="d-flex align-items-center mb-2">
                  <span className="icon me-2">🍎</span> Growing fruits & vegetables
                </li>
                <li className="d-flex align-items-center mb-2">
                  <span className="icon me-2">🌟</span> Tips for ripening your fruits
                </li>
                <li className="d-flex align-items-center">
                  <span className="icon me-2">💻</span> Making this the first true generator on the internet
                </li>
              </ul>
              <button className="btn btn-success">Discover More</button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-5">What We Offer</h2>
          <div className="row">
            <div className="col-md-3">
              <div className="service-card text-center">
                <img src="path-to-service1-image.jpg" alt="Service 1" className="img-fluid rounded" />
                <h3>Agriculture Products</h3>
                <button className="btn btn-success">Read More</button>
              </div>
            </div>
            <div className="col-md-3">
              <div className="service-card text-center">
                <img src="path-to-service2-image.jpg" alt="Service 2" className="img-fluid rounded" />
                <h3>Organic Products</h3>
                <button className="btn btn-success">Read More</button>
              </div>
            </div>
            <div className="col-md-3">
              <div className="service-card text-center">
                <img src="path-to-service3-image.jpg" alt="Service 3" className="img-fluid rounded" />
                <h3>Fresh Vegetables</h3>
                <button className="btn btn-success">Read More</button>
              </div>
            </div>
            <div className="col-md-3">
              <div className="service-card text-center">
                <img src="path-to-service4-image.jpg" alt="Service 4" className="img-fluid rounded" />
                <h3>Dairy Products</h3>
                <button className="btn btn-success">Read More</button>
              </div>
            </div>
          </div>
          <div className="stats row text-center mt-5">
            <div className="col-md-3">
              <h3>Agriculture Products</h3>
            </div>
            <div className="col-md-3">
              <h3>Projects Completed</h3>
            </div>
            <div className="col-md-3">
              <h3>Satisfied Clients</h3>
            </div>
            <div className="col-md-3">
              <h3>Experts Farmers</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="video-section py-5 text-white text-center">
        <h1>Agriculture Matters to the Future of Development</h1>
        <div className="video-container">
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

      {/* Projects Section */}
      <section className="projects py-5">
        <div className="container">
          <h4 className="section-subtitle text-center">Recently Completed</h4>
          <h2 className="text-center mb-5">Explore Projects</h2>
          <div className="row">
            <div className="col-md-4">
              <div className="project-card">
                <img src="path-to-project1-image.jpg" alt="Project 1" className="img-fluid rounded" />
                <h3>Easy Harvesting</h3>
              </div>
            </div>
            <div className="col-md-4">
              <div className="project-card">
                <img src="path-to-project2-image.jpg" alt="Project 2" className="img-fluid rounded" />
                <h3>Agriculture Farming</h3>
              </div>
            </div>
            <div className="col-md-4">
              <div className="project-card">
                <img src="path-to-project3-image.jpg" alt="Project 3" className="img-fluid rounded" />
                <h3>Organic Solutions</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials py-5 bg-light">
        <div className="container">
          <h4 className="section-subtitle">Our Testimonials</h4>
          <h2>What They're Talking About Agrios</h2>
          <div className="row align-items-center">
            <div className="col-md-8">
              <p>
                There are many variations of passages of lorem ipsum available but the majority have suffered alteration in some form by injected humor or random word which don't look even.
              </p>
            </div>
            <div className="col-md-4 text-center">
              <div className="testimonial-card p-4">
                <h5>Bonnie Tolbert</h5>
                <div className="rating">★★★★★</div>
                <span className="status-dot"></span>
              </div>
            </div>
          </div>
          <button className="btn btn-success mt-3">View All Testimonials</button>
        </div>
      </section>

      {/* Reasons Section */}
      <section className="reasons py-5">
        <div className="container">
          <h4 className="section-subtitle">Our Farm Benefits</h4>
          <h2>Why Choose Agrios Market</h2>
          <div className="row align-items-center">
            <div className="col-md-6">
              <img src="path-to-reasons-image.jpg" alt="Reasons" className="img-fluid rounded" />
              {/* <div className="highlight-box">
                <h3>Agriculture Professional Leader</h3>
              </div> */}
            </div>
            <div className="col-md-6">
              <p>
                There are many variations of passages of lorem ipsum available but the majority have suffered alteration in some form by injected humor or random word which don't look even.
              </p>
              <ul className="list-unstyled">
                <li className="d-flex align-items-center mb-3">
                  <span className="check-icon me-2">✔</span> Quality Organic Food
                </li>
                <li className="d-flex align-items-center mb-3">
                  <span className="check-icon me-2">✔</span> Professional Farmers
                </li>
                <li className="d-flex align-items-center">
                  <span className="check-icon me-2">✔</span> Quality Products
                </li>
              </ul>
              <button className="btn btn-success">Discover More</button>
            </div>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="news py-5 bg-light">
        <div className="container">
          <h4 className="section-subtitle text-center">From The Blog</h4>
          <h2 className="text-center mb-5">News & Articles</h2>
          <div className="row">
            <div className="col-md-4">
              <div className="news-card">
                <img src="path-to-news1-image.jpg" alt="News 1" className="img-fluid rounded" />
                <p className="date">05 July 2022</p>
                <p className="author">By Kevin Martin • 1 Comment</p>
                <h3>Bringing Food Production Back To Cities</h3>
              </div>
            </div>
            <div className="col-md-4">
              <div className="news-card">
                <img src="path-to-news2-image.jpg" alt="News 2" className="img-fluid rounded" />
                <p className="date">05 July 2022</p>
                <p className="author">By Kevin Martin • 1 Comment</p>
                <h3>The Future of Farming, Smart Irrigation Solutions</h3>
              </div>
            </div>
            <div className="col-md-4">
              <div className="news-card">
                <img src="path-to-news3-image.jpg" alt="News 3" className="img-fluid rounded" />
                <p className="date">05 July 2022</p>
                <p className="author">By Kevin Martin • 0 Comments</p>
                <h3>Agronomy and relation to Other Sciences</h3>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;