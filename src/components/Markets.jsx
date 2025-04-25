import React, { useState, useEffect } from 'react';
import { FaLeaf } from 'react-icons/fa';
import { auth, db } from './firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import axios from 'axios';

const Markets = () => {
  const [selectedPlant, setSelectedPlant] = useState('Cauliflower');
  const [price, setPrice] = useState(null);
  const [percentageChange, setPercentageChange] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [_user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    const fetchMarketData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`http://localhost:3001/api/price/${selectedPlant}`);
        console.log(`Fetched data for ${selectedPlant}:`, response.data);
        setPrice(response.data.price);
        setPercentageChange(response.data.percentageChange);
        setLastUpdated(new Date().toLocaleString());
      } catch (err) {
        console.error('Error fetching market data:', err);
        setError('Failed to fetch market data. Using default values.');
        setPrice(50);
        setPercentageChange(0.08);
        setLastUpdated(new Date().toLocaleString());
      } finally {
        setLoading(false);
      }
    };

    fetchMarketData();
    const interval = setInterval(fetchMarketData, 300000);

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
      {error && <p className="error-message" style={{ color: 'red', fontSize: '0.9em' }}>{error}</p>}
      <div className="market-item values">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <p className={`market-value ${percentageChange >= 0 ? 'positive' : 'negative'}`}>
              {percentageChange >= 0 ? '+' : ''}{percentageChange}%
            </p>
            <p className="market-value price">{price}</p>
          </>
        )}
      </div>
      {lastUpdated && (
        <p className="last-updated" style={{ fontSize: '0.8em', color: '#666', marginTop: '8px' }}>
          Last Updated: {lastUpdated}
        </p>
      )}
    </div>
  );
};

export default Markets;