import React from 'react';
import Calendar from '../components/CalendarComp';
import './CalendarDash.css';

function CalendarDash() {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const events = {
    5: 'P', 6: 'F', 12: 'F', 18: 'P', 20: 'F', 27: 'F', 28: 'P'
  };
  return (
    <div className="dashboard-content">
      <h1>Calendar</h1>
      <div className="bottom-row">
      <Calendar
                  month={currentMonth}
                  year={currentYear}
                  events={events}
                />
        <div className="soil-status">
          <div className="soil-card">
            <h3>Today's Photo</h3>
            <img
              src="https://www.pthomeandgarden.com/wp-content/uploads/pthomeandgarden_Cauliflower_02.jpg"
              alt="Today's Crop"
              style={{ maxWidth: '200px', marginBottom: '10px' }}
            />
            <div className="status-container">
              <label className="status-label">
              Pesticide
                <input className='calendar-checkbox'
                  type="checkbox"
                />
              </label><br></br>
              <label className="status-label">
              Fertilizer
                <input className='calendar-checkbox'
                  type="checkbox"
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CalendarDash;