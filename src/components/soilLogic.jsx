import { useState, useEffect } from 'react';
import { auth, db } from './firebase';
import { collection, doc, setDoc, onSnapshot } from 'firebase/firestore';
import { getDynamicRecommendation, estimateSoilData } from '../../geminiClient';

// Custom hook to manage soil moisture, pH logic, and fetch weather data
const useSoilLogic = () => {
  const [soilMoisture, setSoilMoisture] = useState(500);
  const [phValue, setPhValue] = useState(6.5);
  const [weather, setWeather] = useState(null);
  const [weatherError, setWeatherError] = useState(null);
  const [geminiData, setGeminiData] = useState(null);
  const [geminiError, setGeminiError] = useState(null);
  const [user, setUser] = useState(null);

  const dryThreshold = 300;
  const wetThreshold = 700;
  const acidicThreshold = 5.5;
  const alkalineThreshold = 7.5;

  const getMoistureStatus = () => {
    if (soilMoisture < dryThreshold) {
      return { text: 'Dry', className: 'status-poor' };
    } else if (soilMoisture <= wetThreshold) {
      return { text: 'Moist', className: 'status-excellent' };
    } else {
      return { text: 'Wet', className: 'status-warning' };
    }
  };

  const getPhStatus = () => {
    if (phValue < acidicThreshold) {
      return { text: 'Too Acidic', className: 'status-poor' };
    } else if (phValue <= alkalineThreshold) {
      return { text: 'Optimal', className: 'status-excellent' };
    } else {
      return { text: 'Too Alkaline', className: 'status-poor' };
    }
  };

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setSoilMoisture(500);
        setPhValue(6.5);
        setGeminiData(null);
        setGeminiError('Please log in');
      }
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const apiKey = import.meta.env.VITE_OPENWEATHERMAP_API_KEY;
        const city = import.meta.env.VITE_WEATHER_CITY || 'London';
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch weather data');
        }
        const data = await response.json();
        setWeather(data);
      } catch (error) {
        console.error('Error fetching weather data:', error);
        setWeatherError(error.message);
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!user || !weather) return;

    const soilDataRef = collection(db, `users/${user.uid}/soilData`);
    const unsubscribe = onSnapshot(soilDataRef, async (snapshot) => {
      const soilDataDocs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const latestSoilData = soilDataDocs.find((d) => d.createdAt) || { 
        soilMoisture: 500, 
        phValue: 6.5, 
        recommendation: 'N/A',
        createdAt: null 
      };

      // Only fetch new data if the cached data is older than 24 hours
      const isCacheValid = latestSoilData.createdAt && 
        (Date.now() - new Date(latestSoilData.createdAt).getTime()) < 24 * 60 * 60 * 1000;

      if (isCacheValid) {
        setSoilMoisture(latestSoilData.soilMoisture);
        setPhValue(latestSoilData.phValue);
        setGeminiData({ recommendation: latestSoilData.recommendation });
        setGeminiError(null);
        return;
      }

      try {
        const soilData = await estimateSoilData(
          weather.main.temp,
          weather.main.humidity,
          weather.weather[0].main.toLowerCase().includes('rain') ? 'yes' : 'no'
        );

        const context = `Soil data: moisture = ${soilData.soilMoisture}, pH = ${soilData.phValue}.`;
        const recommendation = await getDynamicRecommendation(context, 'soil');

        // Cache the results in Firestore
        await setDoc(doc(db, `users/${user.uid}/soilData`, Date.now().toString()), {
          soilMoisture: soilData.soilMoisture,
          phValue: soilData.phValue,
          recommendation: recommendation || 'No recommendation available due to insufficient data.',
          createdAt: new Date().toISOString()
        });

        setSoilMoisture(soilData.soilMoisture);
        setPhValue(soilData.phValue);
        setGeminiData({ recommendation });
        setGeminiError(null);
      } catch (error) {
        console.error('Error fetching soil data or recommendation:', error);
        setSoilMoisture(500);
        setPhValue(6.5);
        setGeminiError(error.message);
        setGeminiData({ recommendation: 'Failed to fetch recommendation: API error.' });
      }
    });

    return () => unsubscribe();
  }, [user, weather]);

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