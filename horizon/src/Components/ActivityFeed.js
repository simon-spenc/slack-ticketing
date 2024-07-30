import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

const ActivityFeed = ({ ticketId, userEmail }) => {
  const [activities, setActivities] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const q = query(
      collection(db, 'tickets', ticketId, 'activities'),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const activitiesList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setActivities(activitiesList);
    });

    return () => unsubscribe();
  }, [ticketId]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (newComment.trim() === '') return;

    try {
      await addDoc(collection(db, 'tickets', ticketId, 'activities'), {
        type: 'comment',
        content: newComment,
        user: userEmail, // Use the user's email instead of 'Current User'
        timestamp: serverTimestamp()
      });
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment: ', error);
    }
  };

  return (
    <div className="activity-feed">
      <h3>Activity Feed</h3>
      <form onSubmit={handleSubmitComment}>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
        />
        <button type="submit">Add Comment</button>
      </form>
      {activities.map(activity => (
        <div key={activity.id} className="activity-item">
          {activity.type === 'comment' && (
            <>
              <p><strong>{activity.user}</strong> commented:</p>
              <p>{activity.content}</p>
            </>
          )}
          <small>{new Date(activity.timestamp?.toDate()).toLocaleString()}</small>
        </div>
      ))}
    </div>
  );
};

export default ActivityFeed;