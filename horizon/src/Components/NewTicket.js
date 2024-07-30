import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { collection, addDoc, getDocs, query, orderBy, limit, where } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { AuthContext } from '../Contexts/AuthContext';

const NewTicket = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('Open');
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const currentDate = new Date();
        try {
            if (!user) {
                throw new Error('No authenticated user');
            }
            const userDoc = await getDocs(query(collection(db, 'users'), where('email', '==', user.email)));
            if (userDoc.empty) {
                throw new Error('User document not found');
            }
            const organizationId = userDoc.docs[0].data().organizationId;
            if (!organizationId) {
                throw new Error('Organization ID not found for user');
            }
            const ticketNumber = await getNextTicketNumber(organizationId);
            const docRef = await addDoc(collection(db, 'tickets'), {
                ticketId: uuidv4(),
                ticketNumber,
                title,
                description,
                status,
                createdAt: currentDate,
                updatedAt: currentDate,
                organizationId
            });
            setTitle('');
            setDescription('');
            setStatus('Open');
            navigate(`/ticket/${docRef.id}`);
        } catch (error) {
            console.error('Error creating ticket: ', error);
            alert(`Error creating ticket: ${error.message}`);
        }
    };
    
    const getNextTicketNumber = async (organizationId) => {
        const ticketsRef = collection(db, 'tickets');
        const q = query(ticketsRef, where('organizationId', '==', organizationId), orderBy('ticketNumber', 'desc'), limit(1));
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