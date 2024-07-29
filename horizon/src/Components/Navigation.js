import React from 'react';
import { Link } from 'react-router-dom';
import '../custom.scss';

const Navigation = () => {
  return (
    <nav className="main-nav">
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/tickets">Ticket List</Link></li>
        <li><Link to="/new-ticket" className="button">Create New Ticket</Link></li>
      </ul>
    </nav>
  );
};

export default Navigation;