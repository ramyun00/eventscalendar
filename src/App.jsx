import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';

import { auth, db, logout, signInWithGoogle } from './firebaseStuff';
import AddNewEvent from './AddNewEvent';
import Events from './Events';
import EventDetail from './components/EventDetail';

import './styles/App.scss';

function App() {
  const [user, loading] = useAuthState(auth);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (loading) return;
    if (user) {
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
    }
  }, [user, loading]);

  if (!user) return false;

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
                onClick={logout}>
                Sign out
              </button>
            </>
          ) : (
            <input
              type="button"
              className="button-primary"
              onClick={signInWithGoogle}
              value="Sign In"
            />
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
