import React, { useState, useEffect } from 'react';
import { FaLeaf } from 'react-icons/fa';
import { fetchMarketData } from '../../geminiClient';

const Markets = () => {
  const [selectedPlant, setSelectedPlant] = useState('Cauliflower');
  const [price, setPrice] = useState(50);
  const [percentageChange, setPercentageChange] = useState(0.08);

  useEffect(() => {
    const profile = localStorage.getItem('selectedPlantProfile');
    if (profile) {
      const parsedProfile = JSON.parse(profile);
      setSelectedPlant(parsedProfile.name !== 'Select Plant Profile' ? parsedProfile.name : 'Cauliflower');
    }
  }, []);

  useEffect(() => {
    const updateMarketData = async () => {
      const marketData = await fetchMarketData(selectedPlant);
      setPrice(marketData.price);
      setPercentageChange(marketData.percentageChange);
    };

    updateMarketData();
    const interval = setInterval(updateMarketData, 300000);

    return () => clearInterval(interval);
  }, [selectedPlant]);

  return (
    <div className="markets-card fade-in">
      <h3>
        <FaLeaf style={{ marginRight: '8px', color: 'var(--secondary-color)' }} />
        Current Price
      </h3>
      <div className="market-item">
        <p className="plant-name">{selectedPlant}</p>
        <p className="unit">RM/kg</p>
      </div>
      <div className="market-item values">
        <p className={`market-value ${percentageChange >= 0 ? 'positive' : 'negative'}`}>
          {percentageChange >= 0 ? '+' : ''}{percentageChange}%
        </p>
        <p className="market-value price">{price}</p>
      </div>
    </div>
  );
};

export default Markets;