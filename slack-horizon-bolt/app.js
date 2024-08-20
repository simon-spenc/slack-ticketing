const { App, AwsLambdaReceiver } = require('@slack/bolt');

const awsLambdaReceiver = new AwsLambdaReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

// Initializes your app with your bot token and signing secret
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  appToken: process.env.SLACK_APP_TOKEN,
  receiver: awsLambdaReceiver,
});

app.message(async ({ message, say }) => {
  // Check if the message is not part of a thread
  if (!message.thread_ts) {
  // say() sends a message to the channel where the event was triggered
    await say({
      blocks: [
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": `This has been logged as a new ticket <@${message.user}>!`
          }
        }
      ],
      text: `This has been logged as a new ticket <@${message.user}>!`,
      thread_ts: message.ts
    });
  }
  // Send an API call
  /*const response = await fetch('https://api.example.com', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ message: message.text })
  });
  const data = await response.json();
  console.log(data);*/
});

// Listen for reaction_added events
app.event('reaction_added', async ({ event, client }) => {
  const reactionHandlers = {
    'white_check_mark': 'This ticket has been marked as completed.',
    'bangbang': 'This ticket has been escalated'
  };

  const reactionMessage = reactionHandlers[event.reaction];
  if (reactionMessage) {
    try {
      // Fetch the message that was reacted to
      const result = await client.conversations.replies({
        channel: event.item.channel,
        ts: event.item.ts,
        limit: 1 // We only need the first message
      });

      const reactedMessage = result.messages[0];
      
      // Check if the reacted message is the thread parent (i.e., it started the thread)
      if (!reactedMessage.thread_ts || reactedMessage.thread_ts === reactedMessage.ts) {
        await client.chat.postMessage({
          channel: event.item.channel,
          text: reactionMessage,
          thread_ts: event.item.ts
        });
      }
    } catch (error) {
      console.error('Error processing reaction_added event:', error);
    }
  }
});
      /* await client.chat.postMessage({
        channel: event.item.channel,
      text: `A new reaction was added to this thread.`,
      thread_ts: event.item.ts
    }); */



/*// This will match any message that contains 👋
app.message(':wave:', async ({ message, say }) => {
  // Handle only newly posted messages here
  if (message.subtype === undefined
    || message.subtype === 'bot_message'
    || message.subtype === 'file_share'
    || message.subtype === 'thread_broadcast') {
    await say(`Hello, <@${message.user}>`);
  }
});*/

// Check for required environment variables
if (!process.env.SLACK_BOT_TOKEN || !process.env.SLACK_SIGNING_SECRET || !process.env.SLACK_APP_TOKEN) {
  console.error('Error: Missing required environment variables.');
  process.exit(1);
}

// Start the app
/*(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);
  console.log('⚡️ Bolt app is running!');
})();*/

// Handler for AWS Lambda
module.exports.handler = async (event, context, callback) => {
  const handler = await awsLambdaReceiver.start();
  return handler(event, context, callback);
}