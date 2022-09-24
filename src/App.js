import { useState, useEffect } from 'react';
import './App.scss';
import { auth, db } from './firebaseStuff';
import { getFirestore, collection, getDocs, addDoc, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";

import EventItem from './EventItem';
import EventForm from './EventForm';

function App() {
  const provider = new GoogleAuthProvider();

  const [name, updateName] = useState('');
  const [date, updateDate] = useState('');
  const [time, updateTime] = useState('');
  const [link, updateLink] = useState('');
  const [description, updateDescription] = useState('');
  const [user, updateUser] = useState(null);
  const [token, setToken] = useState(null);
  const [events, setEvents] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('submit', {
      name,
      date,
      time,
      link,
      description
    });

    const docRef = collection(db, 'events');
    addDoc(docRef, {
      name,
      date,
      time,
      link,
      description,
    });
  }

  const handleClear = () => {
    updateName('');
    updateDate('');
    updateTime('');
    updateLink('');
    updateDescription('');
  }

  const handleSignIn = () => {
    signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      console.log('token', token, 'user', user);
      updateUser(user);
      setToken(token);

      // Get events
      const col = collection(db, 'events');

      onSnapshot(col, (snapshot) => {
        let items = [];
        snapshot.forEach(item => {
          items.push({id: item.id, data: item.data()});
        });
        setEvents(items);
      });
    }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
    });
  };

  const handleSignOut = () => {
    signOut(auth).then(() => {
      // Sign-out successful.
      updateUser({});
      setToken(null);
    }).catch((error) => {
      // An error happened.
    });
  };

  return (
    <div>
      <header>
          <div>
            <h2>Events Calendar</h2>
          </div>
          <div className="header__auth-status">
            {token ? 
              (
                <>
                  {user.photoURL ? (<img className="header__photo" src={user.photoURL}/>) : null}
                  <p>{user ?  user.displayName : 'Logged Out'}</p>
                  <input type="button" onClick={handleSignOut} value="Sign Out" />
                </>
              )
              : 
              (<input type="button" onClick={handleSignIn} value="Sign In" />)}
            
          </div>
          
        </header>
      <div className="events">
        {token ? (
          <>
            <h3>Upcoming</h3>
            {events.map(event => {
              console.log('outer events', events);
              return (
                <EventItem event={event} user={user} />
              );
            })}
            
            <div className="card">
              <h3>Add Event</h3>
              <form onSubmit={handleSubmit} className="event-form__wrapper">
                <div className="form__wrapper">
                  <label htmlFor="name">Event Host Name/Alias:</label>
                  <input name="name" type="text" value={name} onChange={e => updateName(e.target.value)} />
                </div>
                <div className="form__wrapper">
                  <label htmlFor="date">Event Date:</label>
                  <input type="date" value={date} onChange={e => updateDate(e.target.value)} />
                </div>
                <div className="form__wrapper">
                  <label htmlFor="time">Event Time:</label>
                  <input type="text" value={time} onChange={e => updateTime(e.target.value)} />
                </div>
                <div className="form__wrapper">
                  <label htmlFor="link">Link (optional):</label>
                  <input type="text" value={link} onChange={e => updateLink(e.target.value)} />
                </div>
                <div className="form__wrapper form__wrapper-description">
                  <label htmlFor="description">Description:</label>
                  <textarea value={description} onChange={e => updateDescription(e.target.value)} />
                </div>
                <div className="event-form__actions">
                  <input type="submit" value="Submit" className="button-primary" />
                  <input type="button" value="Clear" onClick={handleClear} />
                </div>
              </form>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

export default App;
