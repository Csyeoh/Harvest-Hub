import React, { useState, useEffect } from 'react';
import { FaCloudSun, FaSun, FaCloudRain, FaCloud, FaSnowflake } from 'react-icons/fa';
import { getDynamicRecommendation } from '../../geminiClient';

const CurrentWeather = ({ weatherData, setWeatherData, location, setLocation, addNotification }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedCrop, setSelectedCrop] = useState('Unknown');

  useEffect(() => {
    const fetchSelectedCrop = () => {
      const profile = localStorage.getItem('selectedPlantProfile');
      const parsedProfile = profile ? JSON.parse(profile) : { name: 'Unknown', startDate: '' };
      setSelectedCrop(parsedProfile.name === 'Select Plant Profile' ? 'Unknown' : parsedProfile.name);
    };

    fetchSelectedCrop();
    window.addEventListener('storage', fetchSelectedCrop);
    return () => window.removeEventListener('storage', fetchSelectedCrop);
  }, []);

  const getFallbackWeatherRecommendation = (crop, weather, temp, windSpeed) => {
    let message = `${crop}: `;
    const weatherId = weather[0].id;

    if (weatherId >= 500 && weatherId <= 531) {
      message += `Rain detected (ID: ${weatherId}). Consider protecting ${crop} from excess water.`;
    } else if (temp > 35) {
      message += `High temperature (${temp}°C). Provide shade or increase irrigation for ${crop}.`;
    } else if (temp < 10) {
      message += `Low temperature (${temp}°C). Protect ${crop} from cold stress.`;
    } else if (windSpeed > 10) {
      message += `High wind speed (${windSpeed} m/s). Secure ${crop} against wind damage.`;
    } else {
      return null;
    }

    return message;
  };

  const checkExtremeWeather = async () => {
    if (!weatherData || typeof addNotification !== 'function') {
      console.error('Weather data missing or addNotification is not a function');
      return;
    }

    const { weather, main, wind } = weatherData;
    const context = `Crop: ${selectedCrop}, Weather ID: ${weather[0].id}, Temp: ${main.temp}°C, Wind: ${wind.speed} m/s`;
    let geminiMessage;
    try {
      geminiMessage = await getDynamicRecommendation(context, 'weather');
      console.log('Gemini weather recommendation:', geminiMessage);
    } catch (err) {
      console.error('Error fetching Gemini recommendation for weather:', err);
      geminiMessage = null;
    }

    const message = geminiMessage && geminiMessage !== 'No suggestion available.'
      ? geminiMessage
      : getFallbackWeatherRecommendation(selectedCrop, weather, main.temp, wind.speed);

    if (message) {
      const notification = {
        id: `dynamic-weather-${Date.now()}`,
        message,
        timestamp: new Date().toLocaleTimeString(),
      };

      console.log('Generated weather notification:', notification);
      addNotification(notification);
    } else {
      console.log('No actionable weather suggestion for:', context);
    }
  };

  useEffect(() => {
    if (weatherData) {
      setCurrentTime(new Date());
      checkExtremeWeather();
    }
  }, [weatherData]);

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
      {!weatherData ? (
        <p>Loading weather...</p>
      ) : (
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