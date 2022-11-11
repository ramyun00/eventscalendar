import React, { useEffect, useState } from 'react';
import './App.scss';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { auth, db } from './firebaseStuff';
import AddNewEvent from './AddNewEvent';
import Events from './Events';

function App() {
  const provider = new GoogleAuthProvider();
  const [user, updateUser] = useState(null);
  const [token, setToken] = useState(null);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    console.log('user', user);
  }, [user]);

  const handleSignIn = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const { user } = result;
        updateUser(user);
        setToken(token);

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
        updateUser({});
        setToken(null);
      })
      .catch((error) => {
        // An error happened.
        console.log(error);
      });
  };

  return (
    <>
      <div>
        <header>
          <div>
            <h2>Events Calendar</h2>
          </div>
          <div className="header__auth-status">
            {token ? (
              <>
                {user.photoURL ? (
                  <img
                    className="header__photo"
                    src={user.photoURL}
                    referrerPolicy="no-referrer"
                    alt=""
                  />
                ) : null}
                <p>{user ? user.displayName : 'Logged Out'}</p>
                <input type="button" onClick={handleSignOut} value="Sign Out" />
              </>
            ) : (
              <input type="button" onClick={handleSignIn} value="Sign In" />
            )}
          </div>
        </header>
      </div>
      <Router>
        <Routes>
          <Route path="/new" element={<AddNewEvent user={user} />} />
          <Route
            path="/"
            element={<Events user={user} token={token} events={events} />}
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
