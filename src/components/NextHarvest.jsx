import React, { useState, useEffect } from 'react';
import { auth, db } from './firebase';
import { collection, onSnapshot, doc, setDoc } from 'firebase/firestore';
import { predictHarvestDate } from '../../geminiClient';

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
  if (progress <= 33) {
    // Red (#FF0000) to Orange (#FFA500)
    const factor = progress / 33;
    return interpolateColor('#FF0000', '#FFA500', factor);
  } else if (progress <= 66) {
    // Orange (#FFA500) to Yellow (#FFFF00)
    const factor = (progress - 33) / 33;
    return interpolateColor('#FFA500', '#FFFF00', factor);
  } else {
    // Yellow (#FFFF00) to Green (#00FF00)
    const factor = (progress - 66) / 34;
    return interpolateColor('#FFFF00', '#00FF00', factor);
  }
};

const NextHarvest = () => {
  const [plantName, setPlantName] = useState('Unknown Plant');
  const [_startDate, setStartDate] = useState('');
  const [harvestDate, setHarvestDate] = useState('N/A');
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [_user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const profilesRef = collection(db, `users/${currentUser.uid}/plantProfiles`);
        const unsubscribeSnapshot = onSnapshot(profilesRef, async (snapshot) => {
          const profiles = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          const selectedProfile = profiles.find((p) => p.isSelected) || { 
            name: 'Select Plant Profile', 
            startDate: '',
            predictedHarvestDate: 'N/A'
          };

          if (selectedProfile.name === 'Select Plant Profile' || !selectedProfile.startDate) {
            setPlantName('Please select a plant profile');
            setHarvestDate('N/A');
            setProgress(0);
            setLoading(false);
            return;
          }

          setPlantName(selectedProfile.name);
          setStartDate(selectedProfile.startDate);

          try {
            let predictedDate = selectedProfile.predictedHarvestDate;
            if (!predictedDate || predictedDate === 'N/A') {
              const [year, month, day] = selectedProfile.startDate.split('-');
              const formattedStartDate = `${day}/${month}/${year}`;
              
              predictedDate = await predictHarvestDate(selectedProfile.name, formattedStartDate);
              // Cache the prediction in Firestore
              await setDoc(doc(db, `users/${currentUser.uid}/plantProfiles`, selectedProfile.id), {
                ...selectedProfile,
                predictedHarvestDate: predictedDate || 'Unable to predict'
              }, { merge: true });
            }

            if (predictedDate && predictedDate !== 'Unable to predict') {
              setHarvestDate(predictedDate);

              const start = new Date(selectedProfile.startDate);
              const end = new Date(predictedDate.split('/').reverse().join('-'));
              const today = new Date();

              const totalDuration = end - start;
              const elapsedDuration = today - start;
              const progressPercent = Math.min(100, Math.max(0, (elapsedDuration / totalDuration) * 100)).toFixed(0);

              setProgress(progressPercent);
            } else {
              setHarvestDate('Unable to predict');
              setProgress(0);
            }
          } catch (err) {
            console.error('Error predicting harvest date:', err);
            setHarvestDate('Error');
            setProgress(0);
          }
          setLoading(false);
        }, (err) => {
          console.error('Error listening to plant profiles:', err);
          setPlantName('Error');
          setHarvestDate('Error');
          setProgress(0);
          setLoading(false);
        });

        return () => unsubscribeSnapshot();
      } else {
        setPlantName('Please log in');
        setHarvestDate('N/A');
        setProgress(0);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  if (loading) {
    return (
      <div className="harvest-card fade-in">
        <p>Loading...</p>
      </div>
    );
  }

  const progressColor = getProgressColor(progress);

  return (
    <div className="harvest-card fade-in">
      <table>
        <tbody>
          <tr>
            <td>
              <div>
                <h3>Next Harvest: {plantName}</h3>
                <p>{harvestDate}</p>
              </div>
            </td>
            <td>
              <div 
                className="progress-circle" 
                style={{ background: `conic-gradient(${progressColor} 0% ${progress}%, #ddd ${progress}% 100%)` }}
              >
                <span>
                  <p><b>{progress}%</b></p>
                </span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default NextHarvest;