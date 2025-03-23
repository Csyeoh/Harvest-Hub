// pages/Dashboard.jsx
import React from 'react';
import CurrentWeather from '../components/CurrentWeather';
import NextHarvest from '../components/NextHarvest';
import Markets from '../components/Markets';
import WeatherForecast from '../components/WeatherForecast';
import SoilStatus from '../components/SoilStatus';
import '../App.css'

const Dashboard = () => {
  return (
    <><div className="top-row">
      <CurrentWeather />
      <NextHarvest />
      <Markets />
    </div><div className="mid-row">
        <div className="bottom-row">
          <WeatherForecast />
          <SoilStatus />
        </div>

      </div></>
  );
};

export default Dashboard;