import React, { useEffect } from 'react';
import { FaTint, FaAtom, FaCloudSun } from 'react-icons/fa';
import useSoilLogic from './soilLogic';
import { getDynamicRecommendation } from '../../geminiClient';
import { sendEmail } from '../../sendEmail';
import { auth } from './firebase';

const SoilStatus = () => {
  const { moistureStatus, phStatus, weather, weatherError, geminiData, geminiError } = useSoilLogic();

  useEffect(() => {
    const checkAndNotify = async () => {
      if (!weather || !moistureStatus || !phStatus || !auth.currentUser) return;

      const userEmail = auth.currentUser.email;
      let isAbnormal = false;
      const issues = [];
      const context = {
        weather: {
          temperature: weather.main.temp,
          condition: weather.weather[0].description,
        },
        soil: {
          moisture: moistureStatus.text,
          pH: phStatus.text,
        },
      };

      const temp = weather.main.temp;
      const condition = weather.weather[0].description.toLowerCase();
      if (temp < 10 || temp > 35 || condition.includes('rain') || condition.includes('storm') || condition.includes('snow')) {
        isAbnormal = true;
        issues.push(`Abnormal weather: ${condition}, ${temp}°C`);
      }

      if (moistureStatus.text === 'Dry' || moistureStatus.text === 'Wet') {
        isAbnormal = true;
        issues.push(`Abnormal soil moisture: ${moistureStatus.text}`);
      }
      if (phStatus.text === 'Too Acidic' || phStatus.text === 'Too Alkaline') {
        isAbnormal = true;
        issues.push(`Abnormal soil pH: ${phStatus.text}`);
      }

      if (isAbnormal) {
        const prompt = `Given the following conditions: Weather: ${context.weather.condition}, ${context.weather.temperature}°C; Soil: ${context.soil.moisture} moisture, ${context.soil.pH} pH. Provide a specific, actionable recommendation for farmers in less than 30 words.`;
        const recommendation = await getDynamicRecommendation(JSON.stringify(context), 'combined', prompt);

        const subject = 'Harvest Hub: Abnormal Conditions Alert';
        const body = `
          Dear Farmer,

          The following issues were detected:
          ${issues.join('\n')}

          Recommendation: ${recommendation}

          Please take action to ensure optimal crop growth.

          Best regards,
          Harvest Hub Team
        `;
        const emailSent = await sendEmail(userEmail, subject, body);
        if (emailSent) {
          console.log('Email notification sent successfully');
        } else {
          console.error('Failed to send email notification');
        }
      }
    };

    checkAndNotify();
  }, [weather, moistureStatus, phStatus]);

  return (
    <div className="soil-status">
      <div className="soil-card-d fade-in">
        <FaTint className="soil-icon" />
        <p>
          Soil moisture state: <span className={moistureStatus.className}>{moistureStatus.text}</span>
        </p>
      </div>
      <div className="soil-card-d fade-in">
        <FaAtom className="soil-icon" />
        <p>
          Soil pH state: <span className={phStatus.className}>{phStatus.text}</span>
        </p>
      </div>
      <div className="soil-card-d fade-in">
        <FaCloudSun className="soil-icon" />
        <p>
          Weather: {weatherError ? (
            <span className="status-poor">{weatherError}</span>
          ) : weather ? (
            <span>{weather.weather[0].description}, {weather.main.temp}°C</span>
          ) : (
            <span>Loading...</span>
          )}
        </p>
      </div>
      <div className="soil-card-d fade-in">
        <p>
         {geminiError ? (
            <span className="status-poor">{geminiError}</span>
          ) : geminiData ? (
            <span>{geminiData.recommendation}</span>
          ) : (
            <span>Loading...</span>
          )}
        </p>
      </div>
    </div>
  );
};

export default SoilStatus;