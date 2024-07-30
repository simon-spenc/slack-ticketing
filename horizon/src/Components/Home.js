import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../Contexts/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const Home = () => {
  const { user } = useContext(AuthContext);
  const [welcomeName, setWelcomeName] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setWelcomeName(userData.firstName || userData.organizationName || 'to Horizon Ticketing System');
        }
      }
    };
    fetchUserData();
  }, [user]);

  return (
    <div className="home">
      <h1>Welcome {welcomeName}</h1>
      <p>Manage your tickets efficiently with our easy-to-use platform.</p>
      <div className="home-actions">
        <Link to="/tickets" className="btn btn-primary">View All Tickets</Link>
        <Link to="/new-ticket" className="btn btn-secondary">Create New Ticket</Link>
      </div>
    </div>
  );
};

export default Home;