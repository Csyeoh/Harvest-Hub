import React from 'react';
import './home.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const Home = () => {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero text-center text-white d-flex align-items-center justify-content-center">
        <div>
          <p className="welcome-text">Welcome to Agrios Farming</p>
          <h1 className="hero-title">
            Agriculture <span className="highlight">Eco Farming</span>
          </h1>
          <p className="hero-description">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.
          </p>
          <button className="btn btn-success">Discover More</button>
        </div>
      </section>

      {/* Features Section */}
      <section className="features py-5">
        <div className="container">
          <div className="row">
            <div className="col-md-4">
              <div className="feature-card p-4 text-center">
                <h4 className="feature-title">Feature 01</h4>
                <h3>We're using a new technology</h3>
                <img src="path-to-feature1-image.jpg" alt="Feature 1" className="img-fluid rounded" />
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-card p-4 text-center">
                <h4 className="feature-title">Feature 02</h4>
                <h3>Good in smart organic services</h3>
                <img src="path-to-feature2-image.jpg" alt="Feature 2" className="img-fluid rounded" />
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-card p-4 text-center">
                <h4 className="feature-title">Feature 03</h4>
                <h3>Reforming in the systems</h3>
                <img src="path-to-feature3-image.jpg" alt="Feature 3" className="img-fluid rounded" />
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
                <img src="path-to-large-image.jpg" alt="Large Farm" className="img-fluid large-image rounded" />
                <img src="path-to-small-image.jpg" alt="Small Farm" className="img-fluid small-image rounded" />
              </div>
            </div>
            <div className="col-md-6">
              <h4 className="section-subtitle">Our Introduction</h4>
              <h2>Agriculture & Organic Product Farm</h2>
              <p>Agrios is the largest global organic farm.</p>
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
        <button className="play-btn">▶</button>
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