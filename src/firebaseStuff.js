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
  getAuth,
  signInWithPopup,
  signOut,
} from 'firebase/auth';

const googleProvider = new GoogleAuthProvider();
const firebaseConfig =
  process.env.NODE_ENV === 'development'
    ? {
        apiKey: process.env.REACT_APP_APIKEY,
        authDomain: process.env.REACT_APP_AUTHDOMAIN,
        projectId: process.env.REACT_APP_PROJECTID,
        storageBucket: process.env.REACT_APP_STORAGEBUCKET,
        messagingSenderId: process.env.REACT_APP_MESSAINGSENDERID,
        appId: process.env.REACT_APP_APPID,
      }
    : fetch('/__/firebase/init.json').then(async (response) => {
        await response.json();
      });
console.log(firebaseConfig);
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// if (process.env.NODE_ENV === 'development') {
//   app = initializeApp(firebaseConfig);
// } else {
//   fetch('/__/firebase/init.json').then(async (response) => {
//     const res = await response.json();
//     console.log(res);
//     app = initializeApp(res);
//   });
// }

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

function logout() {
  signOut(auth);
}

export { auth, db, signInWithGoogle, logout };
