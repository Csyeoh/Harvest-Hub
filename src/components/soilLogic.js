import { useState, useEffect } from 'react';

// Custom hook to manage soil moisture, pH logic, and fetch weather data
const useSoilLogic = () => {
  // State for soil moisture and pH
  const [soilMoisture, setSoilMoisture] = useState(500); // Default value, can be updated via API
  const [phValue, setPhValue] = useState(6.5); // Default value, can be updated via API
  
  // State for weather data
  const [weather, setWeather] = useState(null);
  const [weatherError, setWeatherError] = useState(null);

  // State for Gemini API data (placeholder)
  const [geminiData, setGeminiData] = useState(null);
  const [geminiError, setGeminiError] = useState(null);

  // Soil moisture thresholds
  const dryThreshold = 300;
  const wetThreshold = 700;

  // pH thresholds
  const acidicThreshold = 5.5;
  const alkalineThreshold = 7.5;

  // Calculate soil moisture status
  const getMoistureStatus = () => {
    if (soilMoisture < dryThreshold) {
      return { text: "Dry", className: "status-poor" }; // Needs watering
    } else if (soilMoisture <= wetThreshold) {
      return { text: "Moist", className: "status-excellent" }; // Optimal condition
    } else {
      return { text: "Wet", className: "status-warning" }; // Too wet
    }
  };

  // Calculate pH status
  const getPhStatus = () => {
    if (phValue < acidicThreshold) {
      return { text: "Too Acidic", className: "status-poor" }; // Too acidic
    } else if (phValue <= alkalineThreshold) {
      return { text: "Optimal", className: "status-excellent" }; // Optimal condition
    } else {
      return { text: "Too Alkaline", className: "status-poor" }; // Too alkaline
    }
  };

  // Fetch weather data (using OpenWeatherMap API)
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const apiKey = import.meta.env.VITE_OPENWEATHERMAP_API_KEY;
        const city = import.meta.env.VITE_WEATHER_CITY || "London";
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch weather data");
        }
        const data = await response.json();
        setWeather(data);
      } catch (error) {
        console.error("Error fetching weather data:", error);
        setWeatherError(error.message);
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 60000); // Update weather data every minute
    return () => clearInterval(interval);
  }, []);

  // Shared function to fetch soil data from Gemini API
  const fetchSoilData = async () => {
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      const baseUrl = import.meta.env.VITE_GEMINI_API_URL || "https://generativelanguage.googleapis.com";
      const response = await fetch(`${baseUrl}/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `Estimate soil moisture and pH for a region with the following weather: temperature = ${weather?.main?.temp || 25}°C, humidity = ${weather?.main?.humidity || 60}%, and recent rainfall = ${weather?.weather?.[0]?.main.toLowerCase().includes("rain") ? "yes" : "no"}. Provide the result in JSON format like {"soilMoisture": 500, "phValue": 6.5}.`
                }
              ]
            }
          ]
        })
      });
      if (!response.ok) {
        throw new Error("Failed to fetch soil data from Gemini API");
      }
      const data = await response.json();
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!generatedText) {
        throw new Error("No generated text received from Gemini API");
      }
      try {
        const soilData = JSON.parse(generatedText);
        if (!soilData.soilMoisture || !soilData.phValue) {
          throw new Error("Invalid soil data format");
        }
        setSoilMoisture(soilData.soilMoisture);
        setPhValue(soilData.phValue);
      } catch (parseError) {
        console.error("Error parsing Gemini API response:", parseError);
        setSoilMoisture(500); // Fallback to default
        setPhValue(6.5);
      }
    } catch (error) {
      console.error("Error fetching soil data from Gemini API:", error);
      setSoilMoisture(500); // Fallback to default
      setPhValue(6.5);
    }
  };

  // Initial fetch for soil data after weather data is available
  useEffect(() => {
    if (weather) {
      fetchSoilData();
    }
  }, [weather]);

  // Periodic update for soil data
  useEffect(() => {
    const interval = setInterval(fetchSoilData, 3600000); // Update every hour
    return () => clearInterval(interval);
  }, []); // Empty dependency array for periodic updates

  // Fetch recommendations from Gemini API
  useEffect(() => {
    const fetchGeminiData = async () => {
      try {
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        const baseUrl = import.meta.env.VITE_GEMINI_API_URL || "https://generativelanguage.googleapis.com";
        const response = await fetch(`${baseUrl}/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [
                  {
                    text: `Analyze the soil data: moisture = ${soilMoisture}, pH = ${phValue}. Provide recommendations for improving soil quality in JSON format like {"recommendation": "Add lime to increase pH"}.`
                  }
                ]
              }
            ]
          })
        });
        if (!response.ok) {
          throw new Error("Failed to fetch Gemini data");
        }
        const data = await response.json();
        const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!generatedText) {
          throw new Error("No generated text received from Gemini API");
        }
        const analysis = JSON.parse(generatedText);
        setGeminiData(analysis);
      } catch (error) {
        console.error("Error fetching Gemini data:", error);
        setGeminiError(error.message);
      }
    };

    fetchGeminiData();
    const interval = setInterval(fetchGeminiData, 3600000); // Update every hour
    return () => clearInterval(interval);
  }, [soilMoisture, phValue]);

  return {
    moistureStatus: getMoistureStatus(),
    phStatus: getPhStatus(),
    weather,
    weatherError,
    geminiData,
    geminiError,
  };
};

export default useSoilLogic;