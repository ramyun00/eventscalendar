import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

let app;

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
} else {
  fetch('/__/firebase/init.json').then(async (response) => {
    app = initializeApp(await response.json());
  });
}

const db = getFirestore(app);
const auth = getAuth();

export { db, auth };
