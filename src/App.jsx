import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';

import { auth, db, logout, signInWithGoogle } from './firebaseStuff';
import AddNewEvent from './AddNewEvent';
import Events from './Events';

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

  return (
    <main>
      <header className="d-flex">
        <div>
          <h2>Events Calendar</h2>
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
              <input
                type="button"
                className="button-primary"
                onClick={logout}
                value="Sign Out"
              />
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
          <Route path="/new" element={<AddNewEvent user={user} />} />
          <Route path="/" element={<Events user={user} events={events} />} />
        </Routes>
      </Router>
    </main>
  );
}

export default App;
