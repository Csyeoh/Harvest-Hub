import React, { useState, useEffect } from 'react';
import { FaLeaf } from 'react-icons/fa';
import { auth, db } from './firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { fetchMarketData } from '../../geminiClient';

const Markets = () => {
  const [selectedPlant, setSelectedPlant] = useState('Cauliflower');
  const [price, setPrice] = useState(50);
  const [percentageChange, setPercentageChange] = useState(0.08);
  const [_user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const profilesRef = collection(db, `users/${currentUser.uid}/plantProfiles`);
        const unsubscribeSnapshot = onSnapshot(profilesRef, (snapshot) => {
          const profiles = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          const selectedProfile = profiles.find((p) => p.isSelected) || { 
            name: 'Select Plant Profile', 
            startDate: ''
          };
          setSelectedPlant(selectedProfile.name !== 'Select Plant Profile' ? selectedProfile.name : 'Cauliflower');
        }, (err) => {
          console.error('Error listening to plant profiles:', err);
          setSelectedPlant('Cauliflower');
        });

        return () => unsubscribeSnapshot();
      } else {
        setSelectedPlant('Cauliflower');
      }
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    const updateMarketData = async () => {
      try {
        const marketData = await fetchMarketData(selectedPlant);
        setPrice(marketData.price);
        setPercentageChange(marketData.percentageChange);
      } catch (err) {
        console.error('Error fetching market data:', err);
        setPrice(50);
        setPercentageChange(0.08);
      }
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