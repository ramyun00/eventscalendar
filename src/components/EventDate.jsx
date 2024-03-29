import React from 'react';

export default function EventDate({ date, time, size }) {
  if (!date) return <span className="event-item__date-day">No Date</span>;

  const d = new Date(`${date}T00:00:00`);
  const options = {
    timeZone: 'America/New_York',
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  const formattedDate = new Intl.DateTimeFormat('en-US', options).format(d);
  const dateObj = formattedDate.split(',');
  const monthDay = dateObj[1].split(' ');

  return (
    <div className={size === 'sm' ? 'd-flex align-items-center' : 'd-block'}>
      <div
        className={`event-item__date-container bg-primary position-relative ${
          size === 'sm' ? 'event-item__date-container-sm' : ''
        }`}>
        <div className="event-item__date-inside">
          {size !== 'sm' ? (
            <span className="event-item__date-dayname">{dateObj[0]}</span>
          ) : null}
          <span className="event-item__date-day">{monthDay[2]}</span>
          <span className="event-item__date-month">{monthDay[1]}</span>
          {size !== 'sm' ? (
            <span className="event-item__date-time">{time}</span>
          ) : null}
        </div>
      </div>
      {size === 'sm' ? (
        <div className="event-item__time-details ps-3">
          <span className="d-block">{dateObj[0]}</span>
          {time ? (
            <span className="text-muted d-block">
              <span className="event-item__date-time">{time}</span>
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
