import React from 'react';

export default function EventDate({ date, time }) {
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
    <div className="event-item__date-container bg-primary">
      <span className="event-item__date-dayname">{dateObj[0]}</span>
      <span className="event-item__date-day">{monthDay[2]}</span>
      <span className="event-item__date-month">{monthDay[1]}</span>
    </div>
  );
}
