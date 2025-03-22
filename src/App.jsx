// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainNavbar from './components/navbar';
import Sidebar from './components/sidebar';
import TopNavbar from './components/dashboard-top';
import Home from './pages/home';
import About from './pages/about';
import Dashboard from './pages/dashboard';

function App() {
  return (
    <Router>
      <Routes>
        {/* Routes with MainNavbar (Home, About) */}
        <Route
          path=" a"
          element={
            <>
              <MainNavbar />
              <div style={{ marginTop: '60px' }}>
                <Home />
              </div>
            </>
          }
        />
        <Route
          path="/about"
          element={
            <>
              <MainNavbar />
              <div style={{ marginTop: '60px' }}>
                <About />
              </div>
            </>
          }
        />
        {/* Route with Sidebar and TopNavbar (Dashboard) */}
        <Route
          path="/dashboard"
          element={
            <>
              <TopNavbar />
              <div className="d-flex" style={{ marginTop: '60px' }}>
                <Sidebar />
                <div className="main-content flex-grow-1 p-3">
                  <Dashboard />
                </div>
              </div>
            </>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;