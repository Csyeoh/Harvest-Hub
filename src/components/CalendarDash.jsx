import React, { useState, useEffect } from 'react';
import Calendar from '../components/CalendarComp';
import './CalendarDash.css';

function CalendarDash() {
  const currentDate = new Date();
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());

  const [dailyData, setDailyData] = useState(() => {
    const savedData = localStorage.getItem(`dailyData_${currentYear}_${currentMonth}`);
    return savedData ? JSON.parse(savedData) : {};
  });

  const [selectedDay, setSelectedDay] = useState(null);

  useEffect(() => {
    localStorage.setItem(`dailyData_${currentYear}_${currentMonth}`, JSON.stringify(dailyData));
  }, [dailyData, currentYear, currentMonth]);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentYear(prevYear => prevYear - 1);
      setCurrentMonth(11);
    } else {
      setCurrentMonth(prevMonth => prevMonth - 1);
    }
    const newYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    const newMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const savedData = localStorage.getItem(`dailyData_${newYear}_${newMonth}`);
    setDailyData(savedData ? JSON.parse(savedData) : {});
    setSelectedDay(null);
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentYear(prevYear => prevYear + 1);
      setCurrentMonth(0);
    } else {
      setCurrentMonth(prevMonth => prevMonth + 1);
    }
    const newYear = currentMonth === 11 ? currentYear + 1 : currentYear;
    const newMonth = currentMonth === 11 ? 0 : currentMonth + 1;
    const savedData = localStorage.getItem(`dailyData_${newYear}_${newMonth}`);
    setDailyData(savedData ? JSON.parse(savedData) : {});
    setSelectedDay(null);
  };

  const handleImageUpload = (e) => {
    if (!selectedDay) return;
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setDailyData(prev => ({
          ...prev,
          [selectedDay]: {
            ...prev[selectedDay],
            image: reader.result, // Store Base64 string in localStorage
          },
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    if (!selectedDay) return;
    setDailyData(prev => {
      const updatedDay = { ...prev[selectedDay] };
      delete updatedDay.image;
      return {
        ...prev,
        [selectedDay]: updatedDay,
      };
    });
  };

  const handleCheckboxChange = (type, checked) => {
    if (!selectedDay) return;
    setDailyData(prev => {
      const updatedDay = { ...prev[selectedDay] };
      updatedDay[type] = checked;
      if (!checked) {
        delete updatedDay[`${type}Type`];
        delete updatedDay[`${type}Amount`];
      }
      return {
        ...prev,
        [selectedDay]: updatedDay,
      };
    });
  };

  const handleTypeChange = (type, value) => {
    if (!selectedDay) return;
    setDailyData(prev => ({
      ...prev,
      [selectedDay]: {
        ...prev[selectedDay],
        [`${type}Type`]: value,
      },
    }));
  };

  const handleAmountChange = (type, value) => {
    if (!selectedDay) return;
    setDailyData(prev => ({
      ...prev,
      [selectedDay]: {
        ...prev[selectedDay],
        [`${type}Amount`]: value,
      },
    }));
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
          onDayClick={setSelectedDay}
        />
        <div className="soil-status">
          <div className="soil-card">
            <h3>{selectedDay ? `Day ${selectedDay}` : 'Select a Day'}</h3>
            {selectedDay && (
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