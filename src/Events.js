import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquarePlus } from '@fortawesome/free-regular-svg-icons';

import { Link } from "react-router-dom";
import EventItem from './EventItem';

export default function({user, token, events}) {
  return (
    <div className="events">
      {token ? (
        <>
          <div>
            <div className="events__header">
              <h3>Upcoming</h3>
              <div className="add-new">
                <Link to="/new"><FontAwesomeIcon icon={faSquarePlus} /> Add New Event</Link>
              </div>
            </div>
            {events?.map(event => {
              return (
                <EventItem event={event} user={user} />
              );
            })}
          </div>
        </>
      ) : null}
    </div>
  );
}