/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { db } from '../firebaseStuff';
import EventDate from './EventDate';

export default function EventDetail({ user }) {
  const { eventId } = useParams();
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      // Get event
      const docRef = doc(db, 'events', eventId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setEvent(docSnap.data());
      } else {
        console.log('No such document!');
      }

      const commentsRef = collection(db, 'events', eventId, 'comments');

      onSnapshot(commentsRef, (snapshot) => {
        const items = [];
        snapshot.forEach((item) => {
          items.push({ id: item.id, data: item.data() });
        });
        setComments(items);
      });
    }

    if (loading && !event) {
      fetchData();
      setLoading(false);
    }
  }, [event, eventId, comments, loading]);

  const handleAddComment = (e) => {
    e.preventDefault();
    const docRef = doc(db, 'events', eventId);
    const colRef = collection(docRef, 'comments');
    addDoc(colRef, {
      author: user.displayName,
      photoURL: user.photoURL,
      time: serverTimestamp(),
      comment,
    });
    setComment('');
  };

  if (!event) return false;

  return (
    <article className="event-detail-container">
      <button className="btn-link" type="button" onClick={() => navigate(-1)}>
        <FontAwesomeIcon icon={faArrowLeft} />
        <span className="d-inline-block ps-2">Back to events</span>
      </button>
      <div className="d-grid sidebar-layout px-5 pt-3">
        <div className="event-details">
          <h2 className="mb-4">{event.title}</h2>
          <h4>Description</h4>
          <p className="py-3">{event.description}</p>
          {event.link ? (
            <p className="mb-4">
              <strong className="pe-3">More info:</strong>
              <a href={event.link} rel="noreferrer" target="_blank">
                Event Link
              </a>
            </p>
          ) : null}
          <h4 className="mb-4">
            Attendees ({event.going?.length})
            <button type="button" className="btn-link float-right">
              See more
            </button>
          </h4>
          <div className="event__attendees-group d-flex justify-content-start mb-4 pb-4">
            {event.going?.length ? (
              event.going.map((attendee, i) => {
                return (
                  <div
                    className="event__attendees-item card p-4 text-center"
                    key={i}>
                    {attendee.photoURL ? (
                      <img src={attendee.photoURL} alt="" width="40" />
                    ) : null}
                    <span className="d-block">{attendee.name}</span>
                  </div>
                );
              })
            ) : (
              <span className="text-muted">None yet</span>
            )}
          </div>
          <h4 className="mb-4">Comments ({comments?.length})</h4>
          <p>Comments:</p>
          <div className="event__comments">
            <div className="event__comments-form d-flex">
              <img
                src={user.photoURL}
                className="img-fluid"
                width="40px"
                alt=""
              />
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="event__comment-input m-0 w-100 ms-3 me-4"
                placeholder="Write a comment"
              />
              <button
                type="button"
                className="button-primary m-0"
                value="Add comment"
                onClick={handleAddComment}
                disabled={!comment}>
                Post
              </button>
            </div>
            <section className="event__comments--container mt-4">
              {comments
                ? comments.map((comment, i) => {
                    const timestamp = comment?.data?.time;
                    const date =
                      typeof timestamp !== 'string'
                        ? timestamp.toDate()
                        : timestamp;

                    return (
                      <div key={i} className="d-flex mt-2">
                        {comment.data.photoURL ? (
                          <div className="comment--avatar me-3">
                            <img
                              className="img-fluid"
                              src={comment.data.photoURL}
                              alt={comment.data.author}
                              width="40px"
                            />
                          </div>
                        ) : null}
                        <div className="comment--details">
                          <span className="d-block">{comment.data.author}</span>
                          {date ? (
                            <small className="d-block text-muted">
                              {moment(date).startOf('minute').fromNow()}
                            </small>
                          ) : null}
                          <p>{comment.data.comment}</p>
                        </div>
                      </div>
                    );
                  })
                : null}
            </section>
          </div>
        </div>
        <aside className="event-calendar mt-4">
          <div className="card mx-4">
            <div className="d-flex justify-content-between align-items-center mx-4 mt-4 px-2">
              <div className="event-calendar-date">
                <EventDate date={event.date} time={event.time} size="sm" />
              </div>
              <div className="event-calendar-host d-flex">
                {event.photoURL ? (
                  <div>
                    <img
                      className="img-fluid me-2"
                      width="40"
                      src={event.photoURL}
                      alt={event.name}
                    />
                  </div>
                ) : null}
                <div>
                  <span className="d-block">Hosted by</span>
                  <small className="d-block text-muted">{event.name}</small>
                </div>
              </div>
            </div>
            <div className="event-map mt-4">
              {event.address ? (
                <>
                  <div className="mb-4 px-4 mx-4">
                    <FontAwesomeIcon icon={faLocationDot} />
                    <span className="ps-4">{event.address}</span>
                  </div>
                  <iframe
                    title={event.address}
                    width="100%"
                    height="320"
                    className="events__details-map-iframe"
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://www.google.com/maps/embed/v1/place
                ?key=${process.env.GOOGLE_MAPS_API}
                &q=${encodeURIComponent(event.address)}`}
                    allowFullScreen
                  />
                </>
              ) : null}
            </div>
          </div>
        </aside>
      </div>
    </article>
  );
}
