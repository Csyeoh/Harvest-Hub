import React from 'react';
import { FaCloudSun } from 'react-icons/fa';

const CurrentWeather = () => {
  return (
    <div className="weather-card">
      <h3>Current Weather</h3>
      <p className="weather-time">6:50 PM</p>
      <div className="weather-info">
        <FaCloudSun className="weather-icon" />
        <div>
          <p className="temperature">84°F</p>
        </div>
        <div>
          <p><b>Mostly cloudy</b><br></br>Feels like 86°F</p>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;