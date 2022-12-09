import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquarePlus } from '@fortawesome/free-regular-svg-icons';

import { Link } from 'react-router-dom';
import EventItem from './components/EventItem';

export default function Events({ user, events }) {
  // Set the current date to one day previous to allow for same day events
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - 1);

  if (!user || events) return false;

  return (
    <div className="events">
      {events ? (
        <>
          <div className="events__header row d-flex">
            <h3>Upcoming</h3>
            <div className="events__header-add-new text-end">
              <Link to="/new">
                <FontAwesomeIcon icon={faSquarePlus} /> Add New Event
              </Link>
            </div>
          </div>
          <div className="events__upcoming d-grid three-col row">
            {events?.map((event, i) => {
              const eventDate = new Date(`${event.data.date}T00:00:00`);

              // Only show current and future events
              if (eventDate.getTime() <= currentDate.getTime()) return false;

              return <EventItem event={event} user={user} key={i} />;
            })}
          </div>
          <hr />
          <div className="events__older-header row d-flex">
            <h3>Older events</h3>
          </div>
          <div className="d-grid three-col row events__older">
            {events?.map((event, i) => {
              const eventDate = new Date(`${event.data.date}T00:00:00`);

              // Only show current and future events
              if (eventDate.getTime() > currentDate.getTime()) return false;

              return (
                <EventItem event={event} user={user} key={i} oldEvent="true" />
              );
            })}
          </div>
        </>
      ) : null}
    </div>
  );
}
