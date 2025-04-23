import { useState, useEffect } from 'react';
import { getDynamicRecommendation } from '../../geminiClient';

// Custom hook to manage soil moisture, pH logic, and fetch weather data
const useSoilLogic = () => {
  const [soilMoisture, setSoilMoisture] = useState(500);
  const [phValue, setPhValue] = useState(6.5);
  const [weather, setWeather] = useState(null);
  const [weatherError, setWeatherError] = useState(null);
  const [geminiData, setGeminiData] = useState(null);
  const [geminiError, setGeminiError] = useState(null);

  const dryThreshold = 300;
  const wetThreshold = 700;
  const acidicThreshold = 5.5;
  const alkalineThreshold = 7.5;

  const getMoistureStatus = () => {
    if (soilMoisture < dryThreshold) {
      return { text: "Dry", className: "status-poor" };
    } else if (soilMoisture <= wetThreshold) {
      return { text: "Moist", className: "status-excellent" };
    } else {
      return { text: "Wet", className: "status-warning" };
    }
  };

  const getPhStatus = () => {
    if (phValue < acidicThreshold) {
      return { text: "Too Acidic", className: "status-poor" };
    } else if (phValue <= alkalineThreshold) {
      return { text: "Optimal", className: "status-excellent" };
    } else {
      return { text: "Too Alkaline", className: "status-poor" };
    }
  };

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
    const interval = setInterval(fetchWeather, 60000);
    return () => clearInterval(interval);
  }, []);

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
                  text: `Estimate soil moisture and pH for a region with the following weather: temperature = ${weather?.main?.temp || 25}°C, humidity = ${weather?.main?.humidity || 60}%, and recent rainfall = ${weather?.weather?.[0]?.main.toLowerCase().includes("rain") ? "yes" : "no"}. Provide the result in JSON format like {"soilMoisture": 500, "phValue": 6.5}. Ensure the response is valid JSON without markdown or additional text.`
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
      console.log('Raw Gemini API Soil Data Response:', generatedText);
      try {
        let cleanedText = generatedText.trim();
        if (cleanedText.startsWith('```json') && cleanedText.endsWith('```')) {
          cleanedText = cleanedText.slice(7, -3).trim();
        }
        const soilData = JSON.parse(cleanedText);
        if (!soilData.soilMoisture || !soilData.phValue) {
          throw new Error("Invalid soil data format: 'soilMoisture' or 'phValue' missing");
        }
        setSoilMoisture(soilData.soilMoisture);
        setPhValue(soilData.phValue);
      } catch (parseError) {
        console.error("Error parsing Gemini API soil data response:", parseError);
        setSoilMoisture(500);
        setPhValue(6.5);
      }
    } catch (error) {
      console.error("Error fetching soil data from Gemini API:", error);
      setSoilMoisture(500);
      setPhValue(6.5);
    }
  };

  useEffect(() => {
    if (weather) {
      fetchSoilData();
    }
  }, [weather]);

  useEffect(() => {
    const interval = setInterval(fetchSoilData, 3600000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchGeminiData = async () => {
      try {
        const context = `Soil data: moisture = ${soilMoisture}, pH = ${phValue}.`;
        const recommendation = await getDynamicRecommendation(context, 'soil');
        setGeminiData({ recommendation });
        setGeminiError(null);
      } catch (error) {
        console.error("Error fetching Gemini recommendation:", error);
        setGeminiError(error.message);
        setGeminiData({ recommendation: "Failed to fetch recommendation: API error." });
      }
    };

    fetchGeminiData();
    const interval = setInterval(fetchGeminiData, 3600000);
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