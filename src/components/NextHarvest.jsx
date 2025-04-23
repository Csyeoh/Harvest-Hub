import React, { useState, useEffect } from 'react';
import { predictHarvestDate } from '../../geminiClient'; // Note: Path updated to match your latest file

const NextHarvest = () => {
  const [plantName, setPlantName] = useState('Unknown Plant');
  const [startDate, setStartDate] = useState('');
  const [harvestDate, setHarvestDate] = useState('N/A');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Retrieve the selected plant profile from localStorage
    const selectedProfile = JSON.parse(localStorage.getItem('selectedPlantProfile') || '{}');
    const { name = 'Unknown Plant', startDate = '' } = selectedProfile;

    // Debug log to inspect the plant profile
    console.log('Selected plant profile in NextHarvest:', selectedProfile);

    if (name === 'Select Plant Profile' || !startDate) {
      setPlantName('Please select a plant profile');
      setHarvestDate('N/A');
      setProgress(0);
      return;
    }

    setPlantName(name);
    setStartDate(startDate);

    // Debug log to inspect inputs to predictHarvestDate
    console.log('Calling predictHarvestDate with:', { plantName: name, startDate });

  const fetchHarvestDate = async () => {
    // Convert YYYY-MM-DD to DD/MM/YYYY
    const [year, month, day] = startDate.split('-');
    const formattedStartDate = `${day}/${month}/${year}`;
    
    const predictedDate = await predictHarvestDate(name, formattedStartDate);
    if (predictedDate) {
      setHarvestDate(predictedDate);

      // Calculate progress percentage
      const start = new Date(startDate.split('/').reverse().join('-'));
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
  };

  fetchHarvestDate();
}, []);


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
            <div className="progress-circle" style={{ '--progress': `${progress}%` }}>
              <p><b>{progress}%</b></p>
            </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default NextHarvest;