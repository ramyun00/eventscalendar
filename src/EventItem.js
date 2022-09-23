import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from './firebaseStuff';

export default function({event, user}) {
  console.log('event item', event);
  console.log('user in event item', user);
  const handleGoing = e => {
    e.preventDefault();
    const docRef = doc(db, 'events', event.id);
    try {
      updateDoc(docRef, {
        going: arrayUnion(user.displayName)
      })
    } catch (err) {
      alert(err);
    }
  };

  const handleNotGoing = e => {
    e.preventDefault();
    const docRef = doc(db, 'events', event.id);
    try {
      updateDoc(docRef, {
        going: arrayRemove(user.displayName)
      })
    } catch (err) {
      alert(err);
    }
  };

  const handleAddComment = () => {

  }
  return (
    <div className="event-item card">
      <p>Host: {event.data.name}</p>
      <p>Date: {event.data.date}</p>
      <p>Time: {event.data.time}</p>
      <p>Link: {event.data.link}</p>
      <p>Description: {event.description}</p>
      <div className="event__actions">
        <input type="button" value="I'm going" onClick={handleGoing} />
        <input type="button" value="I'm not going" onClick={handleNotGoing}  />
        <input type="button" value="Add comment" onClick={handleAddComment}  />
      </div>
      <div className="event__guests">
        Going: {event.data.going ? event.data.going.map(going => going) : 'None'}
      </div>
    </div>
  )
}