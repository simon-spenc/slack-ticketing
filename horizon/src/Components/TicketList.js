import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Link } from 'react-router-dom';


const TicketList = () => {
    const [tickets, setTickets] = useState([]);

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'tickets'));
                const ticketList = querySnapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        ...data,
                        createdAt: data.createdAt ? data.createdAt.toDate().toLocaleString() : 'N/A'
                    };
                });
                setTickets(ticketList);
            } catch (error) {
                console.error('Error fetching tickets: ', error);
            }
        };

        fetchTickets();
    }, []);

    return (
        <div>
            <h1>Ticket List</h1>
            <div className="ticketList">
                {tickets.map(ticket => (
                    <div className="ticketItem" key={ticket.id}>
                        <Link to={`/ticket/${ticket.id}`}>
                            <h4>{ticket.ticketNumber}</h4>
                            <h3>{ticket.title}</h3>
                            <p>Status: {ticket.status}</p>
                            <p>Description: {ticket.description}</p>
                            <p>Created At: {ticket.createdAt}</p>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TicketList;