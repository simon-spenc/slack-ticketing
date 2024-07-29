import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home">
      <h1>Welcome to Horizon Ticketing System</h1>
      <p>Manage your tickets efficiently with our easy-to-use platform.</p>
      <div className="home-actions">
        <Link to="/tickets" className="btn btn-primary">View All Tickets</Link>
        <Link to="/new-ticket" className="btn btn-secondary">Create New Ticket</Link>
      </div>
    </div>
  );
};

export default Home;