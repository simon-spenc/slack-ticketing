import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { Link } from 'react-router-dom';
import { AuthContext } from '../Contexts/AuthContext';
import '../custom.scss';

const Navigation = ({ organizationName }) => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <nav className="main-nav">
      <ul>
        {user ? (
          <>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/user-management">User Management</Link></li>
            <li><Link to="/tickets">Ticket List</Link></li>
            <li><Link to="/announcements">Announcements</Link></li>
            <li><Link to="/new-ticket" className="button">Create New Ticket</Link></li>
            <li><Link to="/profile">Profile</Link></li>
            <li><button onClick={handleLogout}>Logout</button></li>
            <li>{organizationName && <div className="org-name">{organizationName}</div>}</li>
          </>
        ) : (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/signup">Sign Up</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navigation;