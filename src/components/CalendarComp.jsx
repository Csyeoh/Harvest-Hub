import React from 'react';
import './CalendarComp.css';

function CalendarComp({ month, year, events, images, onDayClick }) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="calendar-card">
      <h2>{monthNames[month]} {year}</h2>
      <div className="calendar-header">
        <span>SUN</span>
        <span>MON</span>
        <span>TUE</span>
        <span>WED</span>
        <span>THU</span>
        <span>FRI</span>
        <span>SAT</span>
      </div>
      <div className="calendar-days">
        {Array(firstDay).fill(null).map((_, i) => (
          <span key={`empty-${i}`} className="empty"></span>
        ))}
        {days.map((day) => (
          <span
            key={day}
            className="calendar-day"
            onClick={() => onDayClick(day)}
            style={{ cursor: 'pointer' }}
          >
            <span className="day-circle">{day}</span>
            <div className="markers">
              {images[day] && <span className="image-marker"></span>}
              {events[day] && (
                <span
                  className={`event ${
                    events[day] === 'P'
                      ? 'pesticide'
                      : events[day] === 'F'
                      ? 'fertilizer'
                      : 'both'
                  }`}
                >
                  {events[day]}
                </span>
              )}
            </div>
          </span>
        ))}
      </div>
    </div>
  );
}

export default CalendarComp;