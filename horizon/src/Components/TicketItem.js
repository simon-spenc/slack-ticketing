import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import useTicket from '../Hooks/useTicket';

const TicketItem = () => {
  const { id } = useParams();
  const { ticket, loading, error, updateTicket } = useTicket(id);
  const [formData, setFormData] = useState({});
  const [saveStatus, setSaveStatus] = useState('');

  useEffect(() => {
    if (ticket) {
      setFormData({ title: ticket.title, description: ticket.description, status: ticket.status });
    }
  }, [ticket]);

  const handleBlur = async (e) => {
    const { name, value } = e.target;
    const newData = { ...formData, [name]: value };
    setFormData(newData);
    setSaveStatus('Saving...');
    const updated = await updateTicket(id, { [name]: value });
    if (updated) {
      setSaveStatus('Saved');
      setTimeout(() => setSaveStatus(''), 2000);
    } else {
      setSaveStatus('');
    }
  };

  if (loading) return <div>Loading ticket...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!ticket) return <div>Ticket not found.</div>;

  return (
    <div className="ticket-item">
      <Link to="/tickets">Back to Ticket List</Link>
      <form>
        <input
          type="text"
          name="title"
          value={formData.title || ''}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          onBlur={handleBlur}
        />
        <textarea
          name="description"
          value={formData.description || ''}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          onBlur={handleBlur}
        />
        <select
          name="status"
          value={formData.status || ''}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          onBlur={handleBlur}
        >
          <option value="open">Open</option>
          <option value="in-progress">In Progress</option>
          <option value="closed">Closed</option>
        </select>
      </form>
      {saveStatus && (
        <div className={`save-status ${saveStatus === 'Saved' ? 'fade-out' : ''}`}>
          {saveStatus}
        </div>
      )}
    </div>
  );
};

export default TicketItem;