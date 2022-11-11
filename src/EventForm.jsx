import React from 'react';
import { Formik } from 'formik';

export default function EventForm(
  onSubmit,
  onClear,
  name,
  updateName,
  date,
  updateDate,
  time,
  updateTime,
  link,
  updateLink,
  description,
  updateDescription
) {
  return (
    <form onSubmit={onSubmit} className="form__wrapper">
      <label htmlFor="name">Event Host Name/Alias:</label>
      <input
        name="name"
        type="text"
        value={name}
        onChange={(e) => updateName(e.target.value)}
      />
      <label htmlFor="date">Event Date:</label>
      <input
        type="date"
        value={date}
        onChange={(e) => updateDate(e.target.value)}
      />
      <label htmlFor="time">Event Time:</label>
      <input
        type="text"
        value={time}
        onChange={(e) => updateTime(e.target.value)}
      />
      <label htmlFor="link">Link (optional):</label>
      <input
        type="text"
        value={link}
        onChange={(e) => updateLink(e.target.value)}
      />
      <label htmlFor="description">Description</label>
      <input
        type="text"
        value={description}
        onChange={(e) => updateDescription(e.target.value)}
      />
      <input type="submit" value="Submit" className="button-primary" />
      <input type="button" value="Clear" onClick={onClear} />
    </form>
  );
}
