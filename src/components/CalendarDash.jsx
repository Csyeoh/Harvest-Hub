import React, { useState, useEffect } from 'react';
import Calendar from '../components/CalendarComp';
import { auth, db } from '../components/firebase';
import { collection, doc, setDoc, onSnapshot } from 'firebase/firestore';
import './CalendarDash.css';

function CalendarDash() {
  const currentDate = new Date();
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
  const [dailyData, setDailyData] = useState({});
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedPlantProfile, setSelectedPlantProfile] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Listen for selected plant profile
        const profilesRef = collection(db, `users/${currentUser.uid}/plantProfiles`);
        const unsubscribeProfiles = onSnapshot(profilesRef, (snapshot) => {
          const profiles = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          const selected = profiles.find((p) => p.isSelected) || null;
          setSelectedPlantProfile(selected);
        }, (err) => {
          console.error('Error fetching plant profiles:', err);
          setSelectedPlantProfile(null);
        });

        return () => unsubscribeProfiles();
      } else {
        setSelectedPlantProfile(null);
        setDailyData({});
        setSelectedDay(null);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (user && selectedPlantProfile) {
      // Listen for calendar data for the current month
      const _startDate = new Date(currentYear, currentMonth, 1);
      const _endDate = new Date(currentYear, currentMonth + 1, 0);
      const calendarRef = collection(db, `users/${user.uid}/plantProfiles/${selectedPlantProfile.id}/calendar`);
      
      const unsubscribeCalendar = onSnapshot(calendarRef, (snapshot) => {
        const data = {};
        snapshot.docs.forEach((doc) => {
          const date = doc.id; // YYYY-MM-DD
          const [year, month] = date.split('-').map(Number);
          if (year === currentYear && month - 1 === currentMonth) {
            const day = parseInt(date.split('-')[2], 10);
            data[day] = doc.data();
          }
        });
        setDailyData(data);
      }, (err) => {
        console.error('Error fetching calendar data:', err);
        setDailyData({});
      });

      return () => unsubscribeCalendar();
    } else {
      setDailyData({});
    }
  }, [user, selectedPlantProfile, currentYear, currentMonth]);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentYear(prevYear => prevYear - 1);
      setCurrentMonth(11);
    } else {
      setCurrentMonth(prevMonth => prevMonth - 1);
    }
    setSelectedDay(null);
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentYear(prevYear => prevYear + 1);
      setCurrentMonth(0);
    } else {
      setCurrentMonth(prevMonth => prevMonth + 1);
    }
    setSelectedDay(null);
  };

  const handleImageUpload = async (e) => {
    if (!selectedDay || !user || !selectedPlantProfile) return;
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
          await setDoc(
            doc(db, `users/${user.uid}/plantProfiles/${selectedPlantProfile.id}/calendar`, dateStr),
            {
              ...dailyData[selectedDay],
              image: reader.result,
              createdAt: new Date().toISOString()
            },
            { merge: true }
          );
        } catch (err) {
          console.error('Error saving image to Firestore:', err);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = async () => {
    if (!selectedDay || !user || !selectedPlantProfile) return;
    try {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
      const updatedDay = { ...dailyData[selectedDay] };
      delete updatedDay.image;
      await setDoc(
        doc(db, `users/${user.uid}/plantProfiles/${selectedPlantProfile.id}/calendar`, dateStr),
        updatedDay,
        { merge: true }
      );
    } catch (err) {
      console.error('Error removing image from Firestore:', err);
    }
  };

  const handleCheckboxChange = async (type, checked) => {
    if (!selectedDay || !user || !selectedPlantProfile) return;
    try {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
      const updatedDay = { ...dailyData[selectedDay] };
      updatedDay[type] = checked;
      if (!checked) {
        delete updatedDay[`${type}Type`];
        delete updatedDay[`${type}Amount`];
      }
      await setDoc(
        doc(db, `users/${user.uid}/plantProfiles/${selectedPlantProfile.id}/calendar`, dateStr),
        {
          ...updatedDay,
          createdAt: new Date().toISOString()
        },
        { merge: true }
      );
    } catch (err) {
      console.error(`Error updating ${type} in Firestore:`, err);
    }
  };

  const handleTypeChange = async (type, value) => {
    if (!selectedDay || !user || !selectedPlantProfile) return;
    try {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
      await setDoc(
        doc(db, `users/${user.uid}/plantProfiles/${selectedPlantProfile.id}/calendar`, dateStr),
        {
          ...dailyData[selectedDay],
          [`${type}Type`]: value,
          createdAt: new Date().toISOString()
        },
        { merge: true }
      );
    } catch (err) {
      console.error(`Error updating ${type} type in Firestore:`, err);
    }
  };

  const handleAmountChange = async (type, value) => {
    if (!selectedDay || !user || !selectedPlantProfile) return;
    try {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
      await setDoc(
        doc(db, `users/${user.uid}/plantProfiles/${selectedPlantProfile.id}/calendar`, dateStr),
        {
          ...dailyData[selectedDay],
          [`${type}Amount`]: value,
          createdAt: new Date().toISOString()
        },
        { merge: true }
      );
    } catch (err) {
      console.error(`Error updating ${type} amount in Firestore:`, err);
    }
  };

  const events = Object.keys(dailyData).reduce((acc, day) => {
    const data = dailyData[day];
    let marker = '';
    if (data.pesticide && data.fertilizer) {
      marker = 'P/F';
    } else if (data.pesticide) {
      marker = 'P';
    } else if (data.fertilizer) {
      marker = 'F';
    }
    if (marker) acc[day] = marker;
    return acc;
  }, {});

  const images = Object.keys(dailyData).reduce((acc, day) => {
    if (dailyData[day].image) acc[day] = true;
    return acc;
  }, {});

  return (
    <div className="dashboard-content">
      <h1>Calendar</h1>
      {!selectedPlantProfile && (
        <p>Please select a plant profile to manage calendar data.</p>
      )}
      <div className="month-navigation">
        <button className="nav-button" onClick={handlePrevMonth}>
          Previous
        </button>
        <button className="nav-button" onClick={handleNextMonth}>
          Next
        </button>
      </div>
      <div className="bottom-row">
        <Calendar
          month={currentMonth}
          year={currentYear}
          events={events}
          images={images}
          onDayClick={selectedPlantProfile ? setSelectedDay : () => {}}
        />
        <div className="soil-status">
          <div className="soil-card">
            <h3>{selectedDay ? `Day ${selectedDay}` : 'Select a Day'}</h3>
            {selectedDay && selectedPlantProfile && (
              <>
                <div className="image-upload">
                  {!dailyData[selectedDay]?.image ? (
                    <label className="upload-button">
                      Upload Image
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        hidden
                      />
                    </label>
                  ) : (
                    <div className="image-actions">
                      <img
                        src={dailyData[selectedDay].image}
                        alt={`Day ${selectedDay}`}
                        style={{ maxWidth: '200px', marginBottom: '10px' }}
                      />
                      <div className="button-group">
                        <label className="upload-button disabled">
                          Upload Image
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled
                            hidden
                          />
                        </label>
                        <button
                          className="remove-image-button"
                          onClick={handleRemoveImage}
                        >
                          Remove Image
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <div className="status-container">
                  <label className="status-label">
                    <input
                      className="custom-checkbox"
                      type="checkbox"
                      checked={dailyData[selectedDay]?.pesticide || false}
                      onChange={(e) => handleCheckboxChange('pesticide', e.target.checked)}
                    />
                    Pesticide
                  </label>
                  {dailyData[selectedDay]?.pesticide && (
                    <>
                      <input
                        type="text"
                        className="type-input"
                        placeholder="Type of Pesticide"
                        value={dailyData[selectedDay]?.pesticideType || ''}
                        onChange={(e) => handleTypeChange('pesticide', e.target.value)}
                      />
                      <input
                        type="number"
                        className="type-input"
                        placeholder="Pesticide Amount (g)"
                        value={dailyData[selectedDay]?.pesticideAmount || ''}
                        onChange={(e) => handleAmountChange('pesticide', e.target.value)}
                      />
                    </>
                  )}
                  <label className="status-label">
                    <input
                      className="custom-checkbox"
                      type="checkbox"
                      checked={dailyData[selectedDay]?.fertilizer || false}
                      onChange={(e) => handleCheckboxChange('fertilizer', e.target.checked)}
                    />
                    Fertilizer
                  </label>
                  {dailyData[selectedDay]?.fertilizer && (
                    <>
                      <input
                        type="text"
                        className="type-input"
                        placeholder="Type of Fertilizer"
                        value={dailyData[selectedDay]?.fertilizerType || ''}
                        onChange={(e) => handleTypeChange('fertilizer', e.target.value)}
                      />
                      <input
                        type="number"
                        className="type-input"
                        placeholder="Fertilizer Amount (g)"
                        value={dailyData[selectedDay]?.fertilizerAmount || ''}
                        onChange={(e) => handleAmountChange('fertilizer', e.target.value)}
                      />
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CalendarDash;