import { useEffect, useState } from 'react';
import { collection, doc, updateDoc, arrayUnion, arrayRemove, deleteDoc, addDoc, getDocs, onSnapshot } from 'firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { db } from './firebaseStuff';

export default function({event, user}) {
  console.log('event item', event);

  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');

  useEffect(() => {
    const commentsRef = collection(db, 'events', event.id, 'comments');

    onSnapshot(commentsRef, (snapshot) => {
      let items = [];
      snapshot.forEach(item => {
        items.push({id: item.id, data: item.data()});
      });
      setComments(items);
    });
  }, [])

  const handleGoing = e => {
    e.preventDefault();
    const docRef = doc(db, 'events', event.id);
    const displayName = user.displayName;
    const person = event.data.notGoing ? event.data.notGoing.find(user => user.name === displayName) : null;
    try {
      if (person) {
        updateDoc(docRef, {
          going: arrayUnion({name: user.displayName, time: getDate()}),
          notGoing: arrayRemove(person)
        })
      } else {
        updateDoc(docRef, {
          going: arrayUnion({name: user.displayName, time: getDate()})
        });
      }
      
    } catch (err) {
      alert(err);
    }
  };

  const handleNotGoing = e => {
    e.preventDefault();
    const docRef = doc(db, 'events', event.id);
    const displayName = user.displayName;
    const person = event.data.going.find(user => user.name === displayName);
    try {

      if (person) {
        updateDoc(docRef, {
          going: arrayRemove(person),
          notGoing: arrayUnion(person)
        });
      } else {
        updateDoc(docRef, {
          notGoing: arrayUnion(person)
        })
      }
      
    } catch (err) {
      alert(err);
    }
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    const docRef = doc(db, 'events', event.id);
    const colRef = collection(docRef, 'comments');
    addDoc(colRef, {
      author: user.displayName,
      time: getDate(),
      comment: comment
    });
    setComment('');
  }

  const handleDelete = (e) => {
    e.preventDefault();
    const docRef = doc(db, 'events', event.id);
    deleteDoc(docRef);
  }

  const getDate = () => {
    const d = new Date();
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const year = d.getFullYear();
    return month + '/' + day + '/' + year;
  }

  return (
    <div className="event-item card">
      <div className="event-item__content">
        <div>
          <h3>{event.data.title}</h3>
          <p>Host: {event.data.name}</p>
          <p>Date: {event.data.date}</p>
          <p>Time: {event.data.time}</p>
          <p>Address: <a href={`https://maps.google.com/?q=${event.data.address}`} target="_blank">{event.data.address}</a></p>
          <p>Link: {event.data.link}</p>
          <p>Description: {event.description}</p>
        </div>
        <div className="event-item__delete" onClick={handleDelete}>
          <button className="event-item__delete-button">
            <FontAwesomeIcon icon={faTrashCan} />
          </button>
        </div>
      </div>
      <div className="event__actions">
        <input type="button" value="I'm going" onClick={handleGoing} />
        <input type="button" value="I'm not going" onClick={handleNotGoing}  />
        
      </div>
      <div className="event__guests">
        <p>Going: {event.data.going ? event.data.going.map(going => going.name + ' ' + going.time) : 'None'}</p>
        <p>Not going: {event.data.notGoing ? event.data.notGoing.map(notGoing => notGoing.name) : 'None'}</p>
        <p>Comments:</p>
        <div className="event__comments">
          Add comment: <input type="text" value={comment} onChange={(e) => setComment(e.target.value)} className="event__comment-input" placeholder="Enter your comment" />
          <input type="button" className="button-primary" value="Add comment" onClick={handleAddComment}  />
          {comments ? comments.map(comment => {
            return (
              <p>
                {comment.data.author} {comment.data.time} { comment.data.comment }
              </p>
            )
          }) : null}
        </div>
      </div>
    </div>
  )
}