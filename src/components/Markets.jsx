import React, { useState, useEffect } from 'react';
import { FaLeaf } from 'react-icons/fa';

const Markets = () => {
  const [selectedPlant, setSelectedPlant] = useState('Cauliflower');

  useEffect(() => {
    const profile = localStorage.getItem('selectedPlantProfile');
    if (profile) {
      const parsedProfile = JSON.parse(profile);
      setSelectedPlant(parsedProfile.name !== 'Select Plant Profile' ? parsedProfile.name : 'Cauliflower');
    }
  }, []);

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
        <p className="market-value positive">+0.08%</p>
        <p className="market-value price">50</p>
      </div>
    </div>
  );
};

export default Markets;