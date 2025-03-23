import React from 'react';
import { FaCloudSun } from 'react-icons/fa';

const WeatherForecast = () => {
  return (
    <div className="weather-forecast">
      <h3>Weather Forecast</h3>
      <div className="forecast-graph">
        <div className="forecast-day">
          <p>Saturday, 22 March 2025</p>
          <p>29°C</p>
          <FaCloudSun className="forecast-icon" />
          <p>Rain: 0.2 in</p>
          <p>Wind: 5 mph</p>
        </div>
        <div className="forecast-day">
          <p>Sunday, 23 March 2025</p>
          <p>28°C</p>
          <FaCloudSun className="forecast-icon" />
          <p>Rain: 0.4 in</p>
          <p>Wind: 4 mph</p>
        </div>
        <div className="forecast-day">
          <p>Monday, 24 March 2025</p>
          <p>27°C</p>
          <FaCloudSun className="forecast-icon" />
          <p>Rain: 0.1 in</p>
          <p>Wind: 7 mph</p>
        </div>
        <div className="forecast-day">
          <p>Tuesday, 25 March 2025</p>
          <p>25°C</p>
          <FaCloudSun className="forecast-icon" />
          <p>Rain: 0.1 in</p>
          <p>Wind: 8 mph</p>
        </div>
        <div className="forecast-day">
          <p>Wednesday, 26 March 2025</p>
          <p>25°C</p>
          <FaCloudSun className="forecast-icon" />
          <p>Rain: 0.1 in</p>
          <p>Wind: 9 mph</p>
        </div>
        <div className="forecast-day">
          <p>Thursday, 27 March 2025</p>
          <p>30°C</p>
          <FaCloudSun className="forecast-icon" />
          <p>Rain: 0.0 in</p>
          <p>Wind: 6 mph</p>
        </div>
        <div className="forecast-day">
          <p>Friday, 28 March 2025</p>
          <p>30°C</p>
          <FaCloudSun className="forecast-icon" />
          <p>Rain: 0.0 in</p>
          <p>Wind: 7 mph</p>
        </div>
      </div>
      <p className="see-historic">See Historic Weather for 2025</p>
    </div>
  );
};

export default WeatherForecast;