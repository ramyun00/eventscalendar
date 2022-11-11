import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addDoc, collection } from 'firebase/firestore';
import { db } from './firebaseStuff';

export default function AddNewEvent({ user }) {
  const [title, setTitle] = useState('');
  const [name, updateName] = useState('');
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
      name,
      date,
      time,
      address,
      link,
      description,
    });
    navigate('/');
  };

  const handleCancel = () => {
    updateName('');
    updateDate('');
    updateTime('');
    updateLink('');
    updateDescription('');
    navigate('/');
  };

  return (
    <div className="card">
      <h3>Add Event</h3>
      <form onSubmit={handleSubmit} className="event-form__wrapper">
        <div className="form__wrapper">
          <label htmlFor="name">Event Title:</label>
          <input
            name="name"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="form__wrapper">
          <label htmlFor="name">Host Name:</label>
          <input
            name="name"
            type="text"
            value={name}
            onChange={(e) => updateName(e.target.value)}
          />
        </div>
        <div className="form__wrapper">
          <label htmlFor="date">Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => updateDate(e.target.value)}
          />
        </div>
        <div className="form__wrapper">
          <label htmlFor="time">Time:</label>
          <input
            type="text"
            value={time}
            onChange={(e) => updateTime(e.target.value)}
          />
        </div>
        <div className="form__wrapper">
          <label htmlFor="time">Address:</label>
          <input
            type="text"
            value={address}
            onChange={(e) => updateAddress(e.target.value)}
          />
        </div>
        <div className="form__wrapper">
          <label htmlFor="link">Link (optional):</label>
          <input
            type="text"
            value={link}
            onChange={(e) => updateLink(e.target.value)}
          />
        </div>
        <div className="form__wrapper form__wrapper-description">
          <label htmlFor="description">Description:</label>
          <textarea
            value={description}
            onChange={(e) => updateDescription(e.target.value)}
          />
        </div>
        <div className="event-form__actions">
          <input type="submit" value="Submit" className="button-primary" />
          <input type="button" value="Cancel" onClick={handleCancel} />
        </div>
      </form>
    </div>
  );
}
