import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const useTicket = (ticketId) => {
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTicket = async () => {
      if (!ticketId) {
        setError('No ticket ID provided');
        setLoading(false);
        return;
      }

      try {
        const ticketRef = doc(db, 'tickets', ticketId);
        const ticketSnap = await getDoc(ticketRef);
        
        if (ticketSnap.exists()) {
          setTicket({ id: ticketSnap.id, ...ticketSnap.data() });
        } else {
          setError('Ticket not found');
        }
      } catch (error) {
        console.error('Error fetching ticket:', error);
        setError('Error fetching ticket');
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [ticketId]);
 
  const updateTicket = async (id, newData) => {
    try {
      const ticketRef = doc(db, 'tickets', id);
      const currentTicketSnap = await getDoc(ticketRef);
      const currentTicketData = currentTicketSnap.data();
  
      // Check if there are any actual changes
      const hasChanges = Object.keys(newData).some(key => 
        currentTicketData[key] !== newData[key]
      );
  
      if (hasChanges) {
        await updateDoc(ticketRef, newData);
        setTicket(prevTicket => ({ ...prevTicket, ...newData }));
        return true; // Indicate that an update occurred
      } else {
        return false; // Indicate that no update was necessary
      }
    } catch (error) {
      console.error('Error updating ticket:', error);
      setError('Error updating ticket');
      return false; // Indicate that the update failed
    }
  };

  return { ticket, loading, error, updateTicket };
};

export default useTicket;