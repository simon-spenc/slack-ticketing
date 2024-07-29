import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, addDoc, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

const NewTicket = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('Open');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const currentDate = new Date();
        try {
            const ticketNumber = await getNextTicketNumber();
            const docRef = await addDoc(collection(db, 'tickets'), {
                ticketId: uuidv4(),
                ticketNumber,
                title,
                description,
                status,
                createdAt: currentDate,
                updatedAt: currentDate
            });
            setTitle('');
            setDescription('');
            setStatus('Open');
            navigate(`/ticket/${docRef.id}`);
        } catch (error) {
            console.error('Error creating ticket: ', error);
            alert('Error creating ticket. Please try again.');
        }
    };

    const getNextTicketNumber = async () => {
        const ticketsRef = collection(db, 'tickets');
        const q = query(ticketsRef, orderBy('ticketNumber', 'desc'), limit(1));
        const querySnapshot = await getDocs(q);
        const lastTicket = querySnapshot.docs[0];
        const lastTicketNumber = lastTicket ? lastTicket.data().ticketNumber : 0;
        return lastTicketNumber + 1;
    };

    return (
        <div>
            <h1>New Ticket</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="title">Title:</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="description">Description:</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="status">Status:</label>
                    <select
                        id="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Closed">Closed</option>
                    </select>
                </div>
                <button type="submit">Create Ticket</button>
            </form>
        </div>
    );
};

export default NewTicket;