import React from 'react';
import './Home.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const Home = () => {
  return (
    <div className="Home">
      {/* Hero Section */}
      <section className="homeHero text-center text-white d-flex align-items-center justify-content-center">
        <div>
          <p className="homeWelcomeText">Welcome to CropWise!</p>
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
      <section className="homeIntroduction py-5">
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
              <p>Farming Forward with CropWise.</p>
              <p>
                CropWise uses advanced AI to analyze satellite imagery, weather data, and soil sensors, helping small-scale farmers double their productivity sustainably.
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
      <section className="services py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-5">What We Offer</h2>
          <div className="row">
            <div className="col-md-3">
              <div className="homeServiceCard text-center">
                <img src="/assets/service1.png" alt="Service 1" className="img-fluid rounded" />
                <h3>Crop Monitoring</h3>
                <button className="btn btn-success">Read More</button>
              </div>
            </div>
            <div className="col-md-3">
              <div className="homeServiceCard text-center">
                <img src="path-to-service2-image.jpg" alt="Service 2" className="img-fluid rounded" />
                <h3>Smart Irrigation</h3>
                <button className="btn btn-success">Read More</button>
              </div>
            </div>
            <div className="col-md-3">
              <div className="homeServiceCard text-center">
                <img src="path-to-service3-image.jpg" alt="Service 3" className="img-fluid rounded" />
                <h3>Soil Health</h3>
                <button className="btn btn-success">Read More</button>
              </div>
            </div>
            <div className="col-md-3">
              <div className="homeServiceCard text-center">
                <img src="path-to-service4-image.jpg" alt="Service 4" className="img-fluid rounded" />
                <h3>Pest Alerts</h3>
                <button className="btn btn-success">Read More</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="homeVideoSection py-5 text-white text-center">
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

      {/* Projects Section */}
      {/* <section className="projects py-5">
        <div className="container">
          <h4 className="homeSectionSubtitle text-center">Recently Completed</h4>
          <h2 className="text-center mb-5">Explore Projects</h2>
          <div className="row">
            <div className="col-md-4">
              <div className="homeProjectCard">
                <img src="path-to-project1-image.jpg" alt="Project 1" className="img-fluid rounded" />
                <h3>Smart Harvesting</h3>
              </div>
            </div>
            <div className="col-md-4">
              <div className="homeProjectCard">
                <img src="path-to-project2-image.jpg" alt="Project 2" className="img-fluid rounded" />
                <h3>AI Farming</h3>
              </div>
            </div>
            <div className="col-md-4">
              <div className="homeProjectCard">
                <img src="path-to-project3-image.jpg" alt="Project 3" className="img-fluid rounded" />
                <h3>Sustainable Solutions</h3>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* Testimonials Section */}
      {/* <section className="testimonials py-5 bg-light">
        <div className="container">
          <h4 className="homeSectionSubtitle">Our Testimonials</h4>
          <h2>What Farmers Say About CropWise</h2>
          <div className="row align-items-center">
            <div className="col-md-8">
              <p>
                "CropWise has transformed my farm with AI insights and smart irrigation, doubling my yield sustainably!"
              </p>
            </div>
            <div className="col-md-4 text-center">
              <div className="homeTestimonialCard p-4">
                <h5>Bonnie Tolbert</h5>
                <div className="homeRating">★★★★★</div>
                <span className="homeStatusDot"></span>
              </div>
            </div>
          </div>
          <button className="btn btn-success mt-3">View All Testimonials</button>
        </div>
      </section> */}

      {/* Reasons Section */}
      <section className="reasons py-5">
        <div className="container">
          <h4 className="homeSectionSubtitle">Our Farm Benefits</h4>
          <h2>Why Choose CropWise</h2>
          <div className="row align-items-center">
            <div className="col-md-6">
              <img src="path-to-reasons-image.jpg" alt="Reasons" className="img-fluid rounded" />
              {/* <div className="homeHighlightBox">
                <h3>AI-Powered Farming Leader</h3>
              </div> */}
            </div>
            <div className="col-md-6">
              <p>
                CropWise uses AI to provide actionable insights, helping small-scale farmers thrive sustainably.
              </p>
              <ul className="list-unstyled">
                <li className="d-flex align-items-center mb-3">
                  <span className="homeCheckIcon me-2">✔</span> Advanced Crop Monitoring
                </li>
                <li className="d-flex align-items-center mb-3">
                  <span className="homeCheckIcon me-2">✔</span> Smart Irrigation Solutions
                </li>
                <li className="d-flex align-items-center">
                  <span className="homeCheckIcon me-2">✔</span> Sustainable Practices
                </li>
              </ul>
              <button className="btn btn-success">Discover More</button>
            </div>
          </div>
        </div>
      </section>

      {/* News Section */}
      {/* <section className="news py-5 bg-light">
        <div className="container">
          <h4 className="homeSectionSubtitle text-center">From The Blog</h4>
          <h2 className="text-center mb-5">News & Articles</h2>
          <div className="row">
            <div className="col-md-4">
              <div className="homeNewsCard">
                <img src="path-to-news1-image.jpg" alt="News 1" className="img-fluid rounded" />
                <p className="homeDate">05 July 2022</p>
                <p className="homeAuthor">By Kevin Martin • 1 Comment</p>
                <h3>Bringing Food Production Back To Cities</h3>
              </div>
            </div>
            <div className="col-md-4">
              <div className="homeNewsCard">
                <img src="path-to-news2-image.jpg" alt="News 2" className="img-fluid rounded" />
                <p className="homeDate">05 July 2022</p>
                <p className="homeAuthor">By Kevin Martin • 1 Comment</p>
                <h3>The Future of Farming, Smart Irrigation Solutions</h3>
              </div>
            </div>
            <div className="col-md-4">
              <div className="homeNewsCard">
                <img src="path-to-news3-image.jpg" alt="News 3" className="img-fluid rounded" />
                <p className="homeDate">05 July 2022</p>
                <p className="homeAuthor">By Kevin Martin • 0 Comments</p>
                <h3>Agronomy and Relation to Other Sciences</h3>
              </div>
            </div>
          </div>
        </div>
      </section> */}
    </div>
  );
};

export default Home;