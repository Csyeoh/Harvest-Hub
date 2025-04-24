import React, { useState, useEffect } from 'react';
import { FaCloudSun, FaSun, FaCloudRain, FaCloud, FaSnowflake } from 'react-icons/fa';
import axios from 'axios';
import { auth, db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';
import { ClipLoader } from 'react-spinners';
import './CurrentWeather.css';

const CurrentWeather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [location, setLocation] = useState('Penang');
  const [inputLocation, setInputLocation] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const OPENWEATHERMAP_API_KEY = import.meta.env.VITE_OPENWEATHERMAP_API_KEY;
  const GEOCODING_API_URL = 'http://api.openweathermap.org/geo/1.0/direct';
  const CURRENT_WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';

  useEffect(() => {
    const fetchUserLocation = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          const userLocation = userDoc.exists() ? userDoc.data().location : '';
          setLocation(userLocation || 'Penang');
        } catch (err) {
          console.error('Error fetching user location:', err);
          setLocation('Penang');
        }
      }
    };
    fetchUserLocation();
  }, []);

  if (!OPENWEATHERMAP_API_KEY) {
    console.error('OpenWeatherMap API key is missing. Please set VITE_OPENWEATHERMAP_API_KEY in your .env file.');
    setError('Error: OpenWeatherMap API key is missing. Please contact support.');
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const fetchCurrentWeather = async (queryLocation) => {
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

      const response = await axios.get(CURRENT_WEATHER_API_URL, {
        params: {
          lat,
          lon,
          appid: OPENWEATHERMAP_API_KEY,
          units: 'metric',
        },
      });

      console.log('OpenWeatherMap Current Weather Response:', response.data);
      setWeatherData(response.data);
    } catch (err) {
      console.error('Error fetching current weather:', err.message);
      console.error('Error details:', err.response?.data);
      if (err.response?.status === 401) {
        setError('Invalid OpenWeatherMap API key. Please check your API key in the .env file or generate a new one at openweathermap.org.');
      } else {
        setError(`Failed to fetch current weather: ${err.message}. Please try again.`);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (OPENWEATHERMAP_API_KEY) {
      fetchCurrentWeather(location);
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
    fetchCurrentWeather(location);
  };

  const getWeatherIcon = (weatherCode) => {
    if (weatherCode === 800) return <FaSun />;
    if (weatherCode >= 801 && weatherCode <= 804) return <FaCloud />;
    if (weatherCode >= 500 && weatherCode <= 531) return <FaCloudRain />;
    if (weatherCode >= 600 && weatherCode <= 622) return <FaSnowflake />;
    return <FaCloudSun />;
  };

  return (
    <div className="weather-card">
      <h3>Current Weather in {location}</h3>
      {loading && (
        <div className="loading-spinner">
          <ClipLoader color={getComputedStyle(document.documentElement).getPropertyValue('--primary-color')} size={30} />
          <p>Loading weather...</p>
        </div>
      )}
      {error && (
        <div>
          <p className="error-message">{error}</p>
          <button onClick={handleRetry} className="retry-btn">
            Retry
          </button>
        </div>
      )}
      {!loading && !error && weatherData && (
        <>
          <p className="weather-time">{currentTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</p>
          <div className="weather-info">
            {getWeatherIcon(weatherData.weather[0].id)}
            <div className="weather-details">
              <p className="temperature">{Math.round(weatherData.main.temp)}°C</p>
              <p className="weather-condition">
                <b>{weatherData.weather[0].description.charAt(0).toUpperCase() + weatherData.weather[0].description.slice(1)}</b>
                <br />
                Feels like {Math.round(weatherData.main.feels_like)}°C
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CurrentWeather;