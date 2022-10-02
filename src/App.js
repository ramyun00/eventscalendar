import { useState } from 'react';
import './App.scss';
import { auth, db } from './firebaseStuff';
import { collection, onSnapshot } from 'firebase/firestore';
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";


import AddNewEvent from './AddNewEvent';
import Events from './Events';


function App() {
  const provider = new GoogleAuthProvider();
  const [user, updateUser] = useState(null);
  const [token, setToken] = useState(null);
  const [events, setEvents] = useState([]);

  const handleSignIn = () => {
    signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
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
    <>
    <div>
      <header>
          <div>
            <h2>Events Calendar</h2>
          </div>
          <div className="header__auth-status">
            {token ? 
              (
                <>
                  {user.photoURL ? (<img className="header__photo" src={user.photoURL} referrerPolicy="no-referrer" />) : null}
                  <p>{user ?  user.displayName : 'Logged Out'}</p>
                  <input type="button" onClick={handleSignOut} value="Sign Out" />
                </>
              )
              : 
              (<input type="button" onClick={handleSignIn} value="Sign In" />)}
          </div>
        </header>
    </div>
    <Router>
      <Routes>
        <Route path="/new" element={<AddNewEvent />} />
        <Route path="/" element={<Events user={user} token={token} events={events} />} />
      </Routes>
    </Router>
    </>
  );
}

export default App;
