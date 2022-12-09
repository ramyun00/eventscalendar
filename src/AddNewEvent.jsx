import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addDoc, collection } from 'firebase/firestore';
import { db } from './firebaseStuff';

export default function AddNewEvent({ user }) {
  const [title, setTitle] = useState('');
  const [date, updateDate] = useState('');
  const [time, updateTime] = useState('');
  const [address, updateAddress] = useState('');
  const [link, updateLink] = useState('');
  const [description, updateDescription] = useState('');

  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    const docRef = collection(db, 'events');
    addDoc(docRef, {
      uid: user.uid,
      title,
      name: user.displayName,
      date,
      time,
      address,
      link,
      description,
    });
    navigate('/');
  };

  const handleCancel = () => {
    updateDate('');
    updateTime('');
    updateLink('');
    updateDescription('');
    navigate('/');
  };

  const isDisabled = !title || !date || !time || !address || !description;

  return (
    <div className="event-detail-container">
      <div className="card p-4">
        <h3>Add Event</h3>
        <form onSubmit={handleSubmit} className="event-form__wrapper">
          <div className="form__wrapper">
            <label htmlFor="title">Event Title:</label>
            <input
              name="title"
              type="text"
              defaultValue={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="form__wrapper">
            <label htmlFor="name">Host Name:</label>
            <input
              name="name"
              type="text"
              defaultValue={user.displayName}
              disabled
            />
          </div>
          <div className="form__wrapper">
            <label htmlFor="date">Date:</label>
            <input
              type="date"
              name="date"
              defaultValue={date}
              onChange={(e) => updateDate(e.target.value)}
              required
            />
          </div>
          <div className="form__wrapper">
            <label htmlFor="time">Time:</label>
            <input
              type="text"
              name="time"
              defaultValue={time}
              onChange={(e) => updateTime(e.target.value)}
              required
            />
          </div>
          <div className="form__wrapper">
            <label htmlFor="address">Address:</label>
            <input
              type="text"
              name="address"
              defaultValue={address}
              onChange={(e) => updateAddress(e.target.value)}
              required
            />
          </div>
          <div className="form__wrapper">
            <label htmlFor="link">Link (optional):</label>
            <input
              type="url"
              defaultValue={link}
              onChange={(e) => updateLink(e.target.value)}
            />
          </div>
          <div className="form__wrapper form__wrapper-description">
            <label htmlFor="description">Description:</label>
            <textarea
              defaultValue={description}
              onChange={(e) => updateDescription(e.target.value)}
              required
            />
          </div>
          <div className="event-form__actions">
            <button className="btn-danger" type="button" onClick={handleCancel}>
              Cancel
            </button>
            <button
              type="submit"
              className="button-primary"
              disabled={isDisabled}>
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
