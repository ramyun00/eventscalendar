import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';

import { auth, db } from './firebaseStuff';
import AddNewEvent from './AddNewEvent';
import Events from './Events';
import EventDetail from './components/EventDetail';

import './styles/App.scss';

function App() {
  const provider = new GoogleAuthProvider();
  const [events, setEvents] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    auth?.onAuthStateChanged((authUser) => {
      if (!user && authUser) {
        setUser({
          email: authUser.email,
          displayName: authUser.displayName,
          photoURL: authUser.photoURL,
          uid: authUser.uid,
        });
        getEvents();
      }
    });
  }, [user, events]);

  const getEvents = () => {
    // Get events
    const col = collection(db, 'events');
    const q = query(col, orderBy('date'));
    onSnapshot(q, (snapshot) => {
      const items = [];
      snapshot.forEach((item) => {
        items.push({ id: item.id, data: item.data() });
      });
      setEvents(items);
    });
  };

  const handleSignIn = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        // The signed-in user info.
        const { user } = result;
        setUser(user);
        getEvents();
      })
      .catch((error) => {
        // Handle Errors here.
        const { code, message, customData } = error;
        // The email of the user's account used.
        const { email } = customData;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
        console.log(code, email, message, credential);
      });
  };

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        setUser(null);
      })
      .catch((error) => {
        // An error happened.
        console.log(error);
      });
  };

  return (
    <main>
      <header className="d-flex align-items-center justify-content-between">
        <div>
          <h1 className="app-title text-uppercase">Events Calendar</h1>
        </div>
        <div className="d-flex header__auth-status">
          {user ? (
            <>
              {user.photoURL ? (
                <img
                  className="header__photo"
                  src={user.photoURL}
                  referrerPolicy="no-referrer"
                  alt=""
                />
              ) : null}
              {user ? user.displayName : 'Logged Out'}
              <button
                type="button"
                className="button-primary mb-0 ms-4"
                onClick={() => handleSignOut()}>
                Sign out
              </button>
            </>
          ) : (
            <button
              type="button"
              className="button-primary mb-0 ms-4"
              onClick={() => handleSignIn()}>
              Sign In
            </button>
          )}
        </div>
      </header>
      <Router>
        <Routes>
          <Route
            index
            path="/"
            element={<Events user={user} events={events} />}
          />
          <Route path="events/:eventId" element={<EventDetail user={user} />} />
          <Route path="/new" element={<AddNewEvent user={user} />} />
        </Routes>
      </Router>
    </main>
  );
}

export default App;
