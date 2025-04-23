import React, { useState, useEffect } from 'react';
import { auth, db } from './firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import HarvestPredictor from '../utils/HarvestPredictor';

// Helper function to convert hex to RGB
const hexToRgb = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
};

// Helper function to convert RGB to hex
const rgbToHex = (r, g, b) => {
  return '#' + [r, g, b].map(x => {
    const hex = Math.round(x).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
};

// Interpolate between two colors based on a percentage
const interpolateColor = (color1, color2, factor) => {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  const r = rgb1.r + (rgb2.r - rgb1.r) * factor;
  const g = rgb1.g + (rgb2.g - rgb1.g) * factor;
  const b = rgb1.b + (rgb2.b - rgb1.b) * factor;
  return rgbToHex(r, g, b);
};

// Calculate the progress color based on percentage
const getProgressColor = (progress) => {
  if (progress <= 50) {
    // Red (#FF0000) to Yellow (#FFFF00)
    const factor = progress / 50;
    return interpolateColor('#FF0000', '#FFFF00', factor);
  } else {
    // Yellow (#FFFF00) to Green (#00FF00)
    const factor = (progress - 50) / 50;
    return interpolateColor('#FFFF00', '#00FF00', factor);
  }
};

const NextHarvest = () => {
  const [harvestData, setHarvestData] = useState({
    estimatedHarvestDate: 'N/A',
    progress: 0,
    riskScore: 0,
  });
  const [loading, setLoading] = useState(true);
  const [_user, setUser] = useState(null);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribeAuth = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Set up real-time listener for plant profiles
        const profilesRef = collection(db, `users/${currentUser.uid}/plantProfiles`);
        const unsubscribeSnapshot = onSnapshot(profilesRef, (snapshot) => {
          const profiles = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          const selectedProfile = profiles.find((p) => p.isSelected) || { 
            estimatedHarvestDate: 'N/A', 
            progress: 0, 
            riskScore: 0 
          };

          setHarvestData({
            estimatedHarvestDate: selectedProfile.estimatedHarvestDate || 'N/A',
            progress: selectedProfile.progress || 0,
            riskScore: selectedProfile.riskScore || 0,
          });
          setLoading(false);
        }, (err) => {
          console.error('Error listening to plant profiles:', err);
          setHarvestData({
            estimatedHarvestDate: 'Error',
            progress: 0,
            riskScore: 0,
          });
          setLoading(false);
        });

        // Clean up the snapshot listener when component unmounts or user changes
        return () => unsubscribeSnapshot();
      } else {
        setHarvestData({
          estimatedHarvestDate: 'N/A',
          progress: 0,
          riskScore: 0,
        });
        setLoading(false);
      }
    });

    // Clean up the auth listener when component unmounts
    return () => unsubscribeAuth();
  }, []);

  if (loading) {
    return (
      <div className="harvest-card">
        <p>Loading...</p>
      </div>
    );
  }

  // Calculate the dynamic color based on progress
  const progressColor = getProgressColor(harvestData.progress);

  return (
    <div className="harvest-card">
      <table>
        <tr>
          <td>
            <div>
              <h3>Next Harvest</h3>
              <p>{harvestData.estimatedHarvestDate}</p>
            </div>
          </td>
          <td>
            <div 
              className="progress-circle" 
              style={{ background: `conic-gradient(${progressColor} 0% ${harvestData.progress}%, #ddd ${harvestData.progress}% 100%)` }}
            >
              <span><p>Achieved</p>
              <p><b>{harvestData.progress}%</b></p>
              </span>
            </div>
          </td>
        </tr>
      </table>
    </div>
  );
};

export default NextHarvest;