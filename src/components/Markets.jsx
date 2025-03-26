import React, { useState, useEffect } from 'react';

const Markets = () => {
  const [selectedPlant, setSelectedPlant] = useState('Cauliflower'); // Default to Cauliflower

  // Fetch the selected plant profile from localStorage
  useEffect(() => {
    const profile = localStorage.getItem('selectedPlantProfile');
    if (profile) {
      const parsedProfile = JSON.parse(profile);
      setSelectedPlant(parsedProfile.name !== 'Select Plant Profile' ? parsedProfile.name : 'Cauliflower');
    }
  }, []);

  return (
    <div className="markets-card">
      <h3>Current Price</h3>
      <div className="market-item">
        <p>{selectedPlant}</p>
        <p className="">RM/kg</p>
      </div>
      <div className="market-item">
        <p className='market-value positive'>+0.08%</p>
        <p className="market-value">50</p>
      </div>
    </div>
  );
};

export default Markets;