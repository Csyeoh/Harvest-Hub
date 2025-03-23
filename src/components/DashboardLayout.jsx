// DashboardLayout.jsx
import React from 'react';
import Sidebar from './sidebar';
import TopNavbar from './dashboard-top';
import { Outlet } from 'react-router-dom';
import './DashboardLayout.css';

const DashboardLayout = () => {
  return (
    <>
      <TopNavbar />
      <div className="dashboard-wrapper">
        <Sidebar />
        <div className="content-container">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default DashboardLayout;