/* eslint-disable import/no-mutable-exports */
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  query,
  getDocs,
  collection,
  where,
  addDoc,
} from 'firebase/firestore';
import {
  GoogleAuthProvider,
  browserLocalPersistence,
  getAuth,
  setPersistence,
  signInWithPopup,
  signOut,
} from 'firebase/auth';

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
  auth = getAuth(app);
  db = getFirestore(app);
} else {
  fetch('/__/firebase/init.json').then(async (response) => {
    app = initializeApp(await response.json());
    auth = getAuth(app);
    db = getFirestore(app);
  });
}

const googleProvider = new GoogleAuthProvider();
const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const { user } = res;
    const q = query(collection(db, 'users'), where('uid', '==', user.uid));
    const docs = await getDocs(q);

    if (docs.docs.length === 0) {
      await addDoc(collection(db, 'users'), {
        authProvider: 'google',
        email: user.email,
        name: user.displayName,
        photoURL: user.photoURL,
        uid: user.uid,
      });
    }
  } catch (err) {
    console.error(err);
  }
};

const logout = () => {
  signOut(auth);
};

(async () => {
  await setPersistence(auth, browserLocalPersistence);
})();

export { auth, db, signInWithGoogle, logout };
