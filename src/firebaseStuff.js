import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

let app;
let db;
let auth;

if (process.env.NODE_ENV === 'development') {
  const firebaseConfig = {
    apiKey: process.env.REACT_APP_APIKEY,
    authDomain: process.env.REACT_APP_AUTHDOMAIN,
    projectId: process.env.REACT_APP_PROJECTID,
    storageBucket: process.env.REACT_APP_STORAGEBUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAINGSENDERID,
    appId: process.env.REACT_APP_APPID,
  };
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth();
} else {
  fetch('/__/firebase/init.json').then(async (response) => {
    app = initializeApp(await response.json());
    db = getFirestore(app);
    auth = getAuth();
  });
}

export { db, auth };
