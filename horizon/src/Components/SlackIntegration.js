import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const SlackIntegration = ({ organizationId }) => {
  const [isConnected, setIsConnected] = useState(false);
  console.log('SlackIntegration rendered with organizationId:', organizationId);

  useEffect(() => {
    const checkSlackConnection = async () => {
      if (organizationId) {
        const orgDoc = await getDoc(doc(db, 'organizations', organizationId));
        if (orgDoc.exists()) {
          setIsConnected(!!orgDoc.data().slackTeamId);
        }
      }
    };
    checkSlackConnection();
  }, [organizationId]);

  const handleSlackConnect = () => {
    if (!organizationId) {
      console.error('Organization ID is undefined');
      alert('Unable to connect to Slack. Organization ID is missing.');
      return;
    }
    console.log('handleSlackConnect');
    console.log(process.env.REACT_APP_SLACK_CLIENT_ID);
    const clientId = process.env.REACT_APP_SLACK_CLIENT_ID;
    const redirectUri = `${process.env.REACT_APP_FRONTEND_URL}/slack-callback`;
    const scope = 'channels:history,chat:write,groups:history,im:history,reactions:read,team:read,users:read,channels:read,incoming-webhook';
    const state = organizationId;

    const slackAuthUrl = `https://slack.com/oauth/v2/authorize?client_id=${clientId}&scope=${scope}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`
    window.location.href = slackAuthUrl;
  };

  const handleSlackDisconnect = async () => {
    try {
      await updateDoc(doc(db, 'organizations', organizationId), {
        slackTeamId: null,
        slackAccessToken: null
      });
      setIsConnected(false);
      alert('Slack disconnected successfully');
    } catch (error) {
      console.error('Error disconnecting Slack:', error);
      alert('Failed to disconnect Slack');
    }
  };

  return (
    <div>
      <h2>Slack Integration</h2>
      {isConnected ? (
        <button onClick={handleSlackDisconnect}>Disconnect from Slack</button>
      ) : (
        <button onClick={handleSlackConnect}>Connect to Slack</button>
      )}
    </div>
  );
};

export default SlackIntegration;