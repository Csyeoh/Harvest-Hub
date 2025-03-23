// App.jsx
import React from 'react';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainNavbar from './components/navbar';
import DashboardLayout from './components/DashboardLayout';
import Home from './pages/home';
import About from './pages/about';
import Dashboard from './pages/dashboard';
import CropCultivation from './pages/CropCultivation';
import Calendar from './pages/Calendar';
import ChatAssistant from './pages/ChatAssistant';
import FarmReport from './pages/FarmReport';
import Settings from './pages/Settings';
import Footer from './components/footer';

function App() {
  return (
    <Router>
      <Routes>
        {/* Routes with MainNavbar (Home, About) */}
        <Route
          path="/"
          element={
            <>
              <MainNavbar />
              {/* <div style={{ marginTop: '60px' }}> */}
              <Home />
              {/* </div> */}
              <Footer />
            </>
          }
        />
        <Route
          path="/about"
          element={
            <>
              <MainNavbar />
              {/* <div style={{ marginTop: '60px' }}> */}
                <About />
              {/* </div> */}
            </>
          }
        />
        {/* Dashboard Routes with Sidebar and TopNavbar */}
        <Route path="/dashboard/*" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} /> {/* /dashboard */}
          <Route path="crop-cultivation" element={<CropCultivation />} /> {/* /dashboard/crop-cultivation */}
          <Route path="calendar" element={<Calendar />} /> {/* /dashboard/calendar */}
          <Route path="chat" element={<ChatAssistant />} /> {/* /dashboard/chat */}
          <Route path="farm-report" element={<FarmReport />} /> {/* /dashboard/farm-report */}
          <Route path="settings" element={<Settings />} /> {/* /dashboard/settings */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;