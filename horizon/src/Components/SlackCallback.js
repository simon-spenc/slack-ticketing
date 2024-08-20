import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const SlackCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState('Connecting to Slack...');

  useEffect(() => {
    const handleSlackCallback = async () => {
      const urlParams = new URLSearchParams(location.search);
      const code = urlParams.get('code');
      const state = urlParams.get('state'); // This is your organizationId

      if (code && state) {
        try {
          // Send the code to your backend to handle the OAuth flow
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/slack/oauth`, { params: { code, state } });
          console.log(response.data);

          if (response.data.success) {
            setStatus('Successfully connected to Slack!');
            // Redirect back to the organization page or dashboard after a short delay
            setTimeout(() => navigate(`/organization/${state}`), 2000);
          } else {
            throw new Error(response.data.error || 'Failed to connect to Slack');
          }
        } catch (error) {
          console.error('Error connecting Slack:', error.response ? error.response.data : error.message);
          setStatus(`Error connecting to Slack: ${error.response?.data?.details || error.message}`);
        }
      } else {
        setStatus('Invalid callback parameters');
      }
    };

    handleSlackCallback();
  }, [location, navigate]);

  return <div>{status}</div>;
};

export default SlackCallback;