import React, { useState, useEffect, useContext } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Link } from 'react-router-dom';
import { AuthContext } from '../Contexts/AuthContext';

const TicketList = () => {
    const [tickets, setTickets] = useState([]);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const userDoc = await getDocs(query(collection(db, 'users'), where('email', '==', user.email)));
                const organizationId = userDoc.docs[0].data().organizationId;
                const q = query(collection(db, 'tickets'), where('organizationId', '==', organizationId));
                const querySnapshot = await getDocs(q);
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
    }, [user]);

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