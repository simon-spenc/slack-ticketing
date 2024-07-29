import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import NewTicket from './NewTicket';

const Dashboard = () => {
    const [showNewTicket, setShowNewTicket] = useState(false);

    return (
        <div>
            <h1>Dashboard</h1>
            <button onClick={() => setShowNewTicket(!showNewTicket)}>
                {showNewTicket ? 'Hide New Ticket' : 'New Ticket'}
            </button>
            <Link to="/tickets">View All Tickets</Link>
            
            {showNewTicket && <NewTicket />}
        </div>
    );
};

export default Dashboard;