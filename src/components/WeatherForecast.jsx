import React, { useState, useEffect } from 'react';
import { FaCloudSun, FaSun, FaCloudRain, FaCloud, FaSnowflake } from 'react-icons/fa';
import axios from 'axios';
import { auth, db } from '../components/firebase'; // Import Firebase
import { doc, getDoc } from 'firebase/firestore';
import './WeatherForecast.css';

const WeatherForecast = () => {
  const [forecastData, setForecastData] = useState([]);
  const [location, setLocation] = useState('Penang'); // Default location
  const [inputLocation, setInputLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const OPENWEATHERMAP_API_KEY = import.meta.env.VITE_OPENWEATHERMAP_API_KEY;
  const GEOCODING_API_URL = 'http://api.openweathermap.org/geo/1.0/direct';
  const FORECAST_API_URL = 'https://api.openweathermap.org/data/2.5/forecast';

  // Fetch user location from Firestore
  useEffect(() => {
    const fetchUserLocation = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          const userLocation = userDoc.exists() ? userDoc.data().location : '';
          setLocation(userLocation || 'Penang'); // Default to Penang if not set
        } catch (err) {
          console.error('Error fetching user location:', err);
          setLocation('Penang'); // Fallback to Penang
        }
      }
    };
    fetchUserLocation();
  }, []);

  // Check for missing API key
  if (!OPENWEATHERMAP_API_KEY) {
    console.error('OpenWeatherMap API key is missing. Please set VITE_OPENWEATHERMAP_API_KEY in your .env file.');
    setError('Error: OpenWeatherMap API key is missing. Please contact support.');
  }

  const fetchWeatherForecast = async (queryLocation) => {
    setLoading(true);
    setError(null);
    try {
      const geoResponse = await axios.get(GEOCODING_API_URL, {
        params: {
          q: queryLocation,
          limit: 1,
          appid: OPENWEATHERMAP_API_KEY,
        },
      });

      if (!geoResponse.data || geoResponse.data.length === 0) {
        throw new Error('Location not found. Please enter a valid city.');
      }

      const { lat, lon } = geoResponse.data[0];

      const response = await axios.get(FORECAST_API_URL, {
        params: {
          lat,
          lon,
          appid: OPENWEATHERMAP_API_KEY,
          units: 'metric',
          cnt: 40,
        },
      });

      console.log('OpenWeatherMap API Response:', response.data);

      const dailyForecast = [];
      const forecastList = response.data.list;

      for (let i = 0; i < forecastList.length && dailyForecast.length < 7; i += 8) {
        const day = forecastList[i];
        dailyForecast.push({
          date: day.dt_txt,
          temperature: Math.round(day.main.temp),
          rain: day.rain ? (day.rain['3h'] || 0) : 0,
          wind: day.wind.speed * 3.6,
          weatherCode: day.weather[0].id,
        });
      }

      setForecastData(dailyForecast);
    } catch (err) {
      console.error('Error fetching weather forecast:', err.message);
      console.error('Error details:', err.response?.data);
      setError(`Failed to fetch weather forecast: ${err.message}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (OPENWEATHERMAP_API_KEY) {
      fetchWeatherForecast(location);
    }
  }, [location]);

  const handleLocationSubmit = (e) => {
    e.preventDefault();
    if (inputLocation.trim()) {
      setLocation(inputLocation.trim());
      setInputLocation('');
    }
  };

  const handleRetry = () => {
    fetchWeatherForecast(location);
  };

  const getWeatherIcon = (weatherCode) => {
    if (weatherCode === 800) return <FaSun />;
    if (weatherCode >= 801 && weatherCode <= 804) return <FaCloud />;
    if (weatherCode >= 500 && weatherCode <= 531) return <FaCloudRain />;
    if (weatherCode >= 600 && weatherCode <= 622) return <FaSnowflake />;
    return <FaCloudSun />;
  };

  return (
    <div className="weather-forecast">
      <h3>Weather Forecast for {location}</h3>
      {loading && <p>Loading forecast...</p>}
      {error && (
        <div>
          <p className="error-message">{error}</p>
          <button onClick={handleRetry} className="retry-btn">
            Retry
          </button>
        </div>
      )}
      {!loading && !error && forecastData.length > 0 && (
        <div className="forecast-graph">
          {forecastData.map((day, index) => (
            <div key={index} className="forecast-day">
              <p>{new Date(day.date).toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
              <p>{day.temperature}°C</p>
              {getWeatherIcon(day.weatherCode)}
              <p>Rain: {(day.rain / 25.4).toFixed(1)} in</p>
              <p>Wind: {(day.wind / 1.60934).toFixed(1)} mph</p>
            </div>
          ))}
        </div>
      )}
      <a href={`https://www.timeanddate.com/weather/malaysia/penang/historic?month=1&year=2025`}
        target="_blank"
        rel="noopener noreferrer" className="see-historic">See Historic Weather for 2025</a>
    </div>
  );
};

export default WeatherForecast;