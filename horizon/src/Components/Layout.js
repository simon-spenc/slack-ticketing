import React, { useState, useEffect, useContext } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { AuthContext } from '../Contexts/AuthContext';
import Navigation from './Navigation';

const Layout = ({ children }) => {
  const [organizationName, setOrganizationName] = useState('');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchOrganizationName = async () => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setOrganizationName(userData.organizationName || '');
        }
      }
    };
    fetchOrganizationName();
  }, [user]);

  return (
    <div className="app-layout">
      <Navigation organizationName={organizationName} />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;