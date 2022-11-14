/* eslint-disable no-alert */
import React, { useEffect, useState } from 'react';
import {
  collection,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  deleteDoc,
  addDoc,
  onSnapshot,
} from 'firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import {
  faCheck,
  faComment,
  faXmark,
  faGlobe,
  faLink,
} from '@fortawesome/free-solid-svg-icons';
import { db } from '../firebaseStuff';
import EventDate from './EventDate';

export default function EventItem({ event, oldEvent, user }) {
  const { data } = event;
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');

  useEffect(() => {
    const commentsRef = collection(db, 'events', event.id, 'comments');

    onSnapshot(commentsRef, (snapshot) => {
      const items = [];
      snapshot.forEach((item) => {
        items.push({ id: item.id, data: item.data() });
      });
      setComments(items);
    });
  }, [event.id]);

  const handleGoing = (e) => {
    e.preventDefault();
    const docRef = doc(db, 'events', event.id);
    const { displayName } = user;
    const person = event.data.notGoing
      ? event.data.notGoing.find((user) => user.name === displayName)
      : null;

    try {
      if (person) {
        updateDoc(docRef, {
          going: arrayUnion({ name: user.displayName, time: getDate() }),
          notGoing: arrayRemove(person),
        });
      } else {
        updateDoc(docRef, {
          going: arrayUnion({ name: user.displayName, time: getDate() }),
        });
      }
    } catch (err) {
      alert(err);
    }
  };

  const handleNotGoing = (e) => {
    e.preventDefault();
    const docRef = doc(db, 'events', event.id);
    const { displayName } = user;
    const person = data.going.find((user) => user.name === displayName);
    try {
      if (person) {
        updateDoc(docRef, {
          going: arrayRemove(person),
          notGoing: arrayUnion(person),
        });
      } else {
        updateDoc(docRef, {
          notGoing: arrayUnion(person),
        });
      }
    } catch (err) {
      alert(err);
    }
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    const docRef = doc(db, 'events', event.id);
    const colRef = collection(docRef, 'comments');
    addDoc(colRef, {
      author: user.displayName,
      time: getDate(),
      comment,
    });
    setComment('');
  };

  const handleDelete = (e) => {
    e.preventDefault();
    const docRef = doc(db, 'events', event.id);
    deleteDoc(docRef);
  };

  const getDate = () => {
    const d = new Date();
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const year = d.getFullYear();
    return `${month}/${day}/${year}`;
  };

  console.log(!oldEvent && data.going);

  return (
    <div className="event-item card">
      <div className="event-item__header">
        <div className="d-flex">
          <div className="event-item__header-info">
            <h3>{data.title ? data.title : 'New Event'}</h3>
            <hr />
            <div className="d-flex">
              <div className="event-item__header-going">
                {data.going?.length ? (
                  <>
                    <FontAwesomeIcon icon={faCheck} className="text-primary" />{' '}
                    {data.going.map((going, i) =>
                      i < 5
                        ? `${going.name}${
                            data.going.length > 1 && i !== data.going.length - 1
                              ? ', '
                              : ''
                          }`
                        : null
                    )}
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faCheck} className="text-primary" />
                    {' 0'}
                  </>
                )}
                {data.going?.length > 5
                  ? ` and ${data.going.length - 5} others`
                  : null}
              </div>
              <div className="event-item__header-notgoing">
                <FontAwesomeIcon icon={faXmark} className="text-danger" />{' '}
                {data.notGoing ? data.notGoing.length : '0'}
              </div>
              <div className="event-item__header-comments">
                <FontAwesomeIcon icon={faComment} className="text-primary" />{' '}
                {comments ? comments.length : '0'}
              </div>
            </div>
          </div>
          {data.date ? <EventDate date={data.date} time={data.time} /> : null}
        </div>
      </div>
      <div className="d-flex event-item__toobar bg-primary">
        {/* TODO: Replace this with the host's avatar/profile link */}
        <div className="event-item__toolbar-host">Host: {data.name}</div>
        {data.address ? (
          <div className="event-item__toolbar-location">
            <FontAwesomeIcon icon={faGlobe} />
            &nbsp;
            <a
              href={`https://maps.google.com/?q=${data.address}`}
              target="_blank"
              rel="noreferrer">
              {data.address}
            </a>
          </div>
        ) : null}
        {data.link ? (
          <div className="event-item__toolbar-link">
            <FontAwesomeIcon icon={faLink} />
            &nbsp;
            <a
              href={`https://maps.google.com/?q=${data.link}`}
              target="_blank"
              rel="noreferrer">
              {data.link}
            </a>
          </div>
        ) : null}
      </div>
      <div className="event-item__content">
        <p className="event-item__description">{data.description}</p>
        {/* <p>Comments:</p>
        <div className="event__comments">
          Add comment:{' '}
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="event__comment-input"
            placeholder="Enter your comment"
          />
          <input
            type="button"
            className="button-primary"
            value="Add comment"
            onClick={handleAddComment}
          />
          {comments
            ? comments.map((comment, i) => {
                return (
                  <p key={i}>
                    {comment.data.author} {comment.data.time}{' '}
                    {comment.data.comment}
                  </p>
                );
              })
            : null}
        </div> */}
      </div>
      {!oldEvent ? <hr /> : null}
      {!oldEvent ? (
        <div className="event__actions position-absolute">
          {user.uid === data.uid ? (
            <button
              className="event-item__delete-button button-warning"
              onClick={handleDelete}
              type="button">
              <FontAwesomeIcon icon={faTrashCan} />
            </button>
          ) : null}
          <button
            type="button"
            className="button-danger"
            onClick={handleNotGoing}>
            <FontAwesomeIcon icon={faXmark} />
            &nbsp; Not going
          </button>
          <button
            type="button"
            className="button-primary"
            onClick={handleGoing}>
            <FontAwesomeIcon icon={faCheck} />
            &nbsp;Going
          </button>
        </div>
      ) : null}
    </div>
  );
}
