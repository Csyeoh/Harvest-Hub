import React, { useState, useEffect } from 'react';
import { FaTint, FaAtom } from 'react-icons/fa';
import { Form, FormControl, Button } from 'react-bootstrap';
import { getDynamicRecommendation } from '../../geminiClient';

const SoilStatus = ({ addNotification, clearSoilNotifications, weatherData }) => {
  const [soilMoisture, setSoilMoisture] = useState(15);
  const [soilPH, setSoilPH] = useState(5.5);
  const [inputMoisture, setInputMoisture] = useState(15);
  const [inputPH, setInputPH] = useState(5.5);
  const [moistureStatus, setMoistureStatus] = useState('poor');
  const [pHStatus, setPHStatus] = useState('poor');
  const [temperatureStatus, setTemperatureStatus] = useState('poor');
  const [rainfallStatus, setRainfallStatus] = useState('poor');
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

  const getFallbackRecommendation = (crop, moisture, pH, temperature, rainfall, statuses) => {
    let message = `${crop}: `;
    const issues = [];

    if (statuses.moistureStatus !== 'excellent') {
      if (statuses.moistureStatus === 'poor') {
        issues.push(`Soil moisture ${moisture}% is poor. Increase irrigation by 10% daily.`);
      } else {
        issues.push(`Soil moisture ${moisture}% is average. Adjust irrigation accordingly.`);
      }
    }

    if (statuses.pHStatus !== 'excellent') {
      if (statuses.pHStatus === 'poor') {
        issues.push(`Soil pH ${pH} is poor. Adjust with lime or sulfur as needed.`);
      } else {
        issues.push(`Soil pH ${pH} is average. Fine-tune pH for optimal growth.`);
      }
    }

    if (statuses.temperatureStatus !== 'excellent') {
      if (statuses.temperatureStatus === 'poor') {
        issues.push(`Temperature ${temperature}°C is poor. Protect ${crop} from extreme heat/cold.`);
      } else {
        issues.push(`Temperature ${temperature}°C is average. Monitor ${crop} for stress.`);
      }
    }

    if (statuses.rainfallStatus !== 'excellent') {
      if (statuses.rainfallStatus === 'poor') {
        issues.push(`Rainfall condition (ID: ${rainfall}) is poor. Protect ${crop} from excess/lack of water.`);
      } else {
        issues.push(`Rainfall condition (ID: ${rainfall}) is average. Adjust irrigation as needed.`);
      }
    }

    if (issues.length === 0) {
      return null;
    }

    message += issues.join(' ');
    return message;
  };

  const fetchConditionsInterpretation = async (moisture, pH, temperature, rainfall) => {
    if (typeof addNotification !== 'function') {
      console.error('addNotification is not a function');
      return { moistureStatus: 'poor', pHStatus: 'poor', temperatureStatus: 'poor', rainfallStatus: 'poor', message: null };
    }

    const context = `Crop: ${selectedCrop}, Soil Moisture: ${moisture}%, pH: ${pH}, Temperature: ${temperature}°C, Rainfall Weather ID: ${rainfall}`;
    let geminiResponse;
    try {
      const promptOverride = `Given the following data and crop, evaluate the soil moisture, pH, temperature, and rainfall. Return the status of each as "excellent", "average", or "poor", and provide a specific, actionable action plan for farmers if any condition is not excellent, in less than 30 words: ${context}. Format response as: "Moisture: <status>, pH: <status>, Temperature: <status>, Rainfall: <status>. <Recommendation>"`;
      geminiResponse = await getDynamicRecommendation(context, 'combined', promptOverride);
      console.log('Gemini combined conditions response:', geminiResponse);
    } catch (err) {
      console.error('Error fetching Gemini recommendation for combined conditions:', err);
      geminiResponse = null;
    }

    let newMoistureStatus = 'poor';
    let newPHStatus = 'poor';
    let newTemperatureStatus = 'poor';
    let newRainfallStatus = 'poor';
    let recommendation = null;

    if (geminiResponse && !geminiResponse.startsWith('Failed') && !geminiResponse.startsWith('Unable')) {
      const match = geminiResponse.match(/Moisture: (\w+), pH: (\w+), Temperature: (\w+), Rainfall: (\w+)\.(.+)/);
      if (match) {
        newMoistureStatus = match[1].toLowerCase();
        newPHStatus = match[2].toLowerCase();
        newTemperatureStatus = match[3].toLowerCase();
        newRainfallStatus = match[4].toLowerCase();
        recommendation = geminiResponse;
      } else {
        console.warn('Gemini response format unexpected:', geminiResponse);
      }
    }

    if (!recommendation) {
      newMoistureStatus = moisture < 20 || moisture > 60 ? 'poor' : (moisture >= 30 && moisture <= 50 ? 'excellent' : 'average');
      newPHStatus = pH < 6.0 || pH > 7.0 ? 'poor' : (pH >= 6.2 && pH <= 6.8 ? 'excellent' : 'average');
      newTemperatureStatus = temperature < 10 || temperature > 35 ? 'poor' : (temperature >= 20 && temperature <= 30 ? 'excellent' : 'average');
      newRainfallStatus = rainfall >= 500 && rainfall <= 531 ? 'poor' : (rainfall === 800 ? 'excellent' : 'average');
      recommendation = getFallbackRecommendation(selectedCrop, moisture, pH, temperature, rainfall, {
        moistureStatus: newMoistureStatus,
        pHStatus: newPHStatus,
        temperatureStatus: newTemperatureStatus,
        rainfallStatus: newRainfallStatus,
      });
    }

    return {
      moistureStatus: newMoistureStatus,
      pHStatus: newPHStatus,
      temperatureStatus: newTemperatureStatus,
      rainfallStatus: newRainfallStatus,
      message: recommendation,
    };
  };

  const checkConditions = async () => {
    const temperature = weatherData?.main?.temp ?? 25;
    const rainfall = weatherData?.weather?.[0]?.id ?? 800;

    const { moistureStatus: newMoistureStatus, pHStatus: newPHStatus, temperatureStatus: newTemperatureStatus, rainfallStatus: newRainfallStatus, message } = await fetchConditionsInterpretation(
      soilMoisture,
      soilPH,
      temperature,
      rainfall
    );

    setMoistureStatus(newMoistureStatus);
    setPHStatus(newPHStatus);
    setTemperatureStatus(newTemperatureStatus);
    setRainfallStatus(newRainfallStatus);

    const isAbnormal = newMoistureStatus !== 'excellent' || newPHStatus !== 'excellent' || newTemperatureStatus !== 'excellent' || newRainfallStatus !== 'excellent';

    if (!isAbnormal) {
      console.log('All conditions are optimal, no notification needed.');
      return;
    }

    if (typeof clearSoilNotifications === 'function') {
      clearSoilNotifications();
    } else {
      console.error('clearSoilNotifications is not a function');
    }

    if (message) {
      const notification = {
        id: `dynamic-soil-${Date.now()}`,
        message,
        timestamp: new Date().toLocaleTimeString(),
      };

      console.log('Generated combined conditions notification:', notification);
      addNotification(notification);
    } else {
      console.log('No actionable suggestion for:', { soilMoisture, soilPH, temperature, rainfall });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const moisture = parseFloat(inputMoisture);
    const pH = parseFloat(inputPH);
    if (!isNaN(moisture) && !isNaN(pH)) {
      setSoilMoisture(moisture);
      setSoilPH(pH);
      await checkConditions();
    } else {
      alert('Please enter valid numbers for soil moisture and pH.');
    }
  };

  return (
    <div className="soil-status">
      <div className="soil-monitor-form p-3" style={{ backgroundColor: '#f8f9fa', borderRadius: '8px', margin: '20px 0' }}>
        <h4>Soil Condition Input</h4>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Soil Moisture (%)</Form.Label>
            <FormControl
              type="number"
              step="0.1"
              value={inputMoisture}
              onChange={(e) => setInputMoisture(e.target.value)}
              placeholder="Enter soil moisture percentage"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Soil pH</Form.Label>
            <FormControl
              type="number"
              step="0.1"
              value={inputPH}
              onChange={(e) => setInputPH(e.target.value)}
              placeholder="Enter soil pH"
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Update Soil Conditions
          </Button>
        </Form>
      </div>

      <div className="soil-card-d">
        <FaTint className="soil-icon" />
        <p>Soil moisture: <span className={`status-${moistureStatus}`}>{moistureStatus}</span> ({soilMoisture}%)</p>
      </div>
      <div className="soil-card-d">
        <FaAtom className="soil-icon" />
        <p>Soil pH: <span className={`status-${pHStatus}`}>{pHStatus}</span> ({soilPH})</p>
      </div>
    </div>
  );
};

export default SoilStatus;