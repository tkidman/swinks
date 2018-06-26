// Initialize using verification token from environment variables
// http://759dc676.ngrok.io/slack/events
// https://open.spotify.com/track/0nKe1H75sjT2lQMH1gjR3e
const { createSlackEventAdapter } = require('@slack/events-api');
const request = require('request-promise-native');
const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const { getPlayURL, getPlayTrackByUrl } = require('./src/play');
const { getSpotifyURL, getSpotifyTrackByUrl } = require('./src/spotify');

const slackEvents = createSlackEventAdapter(process.env.SLACK_VERIFICATION_TOKEN);
const slackWebhookURL = process.env.SLACK_WEBHOOK_URL;
const port = process.env.PORT || 3000;

const app = express();
app.use(bodyParser.json());

// Mount the event handler on a route
// NOTE: you must mount to a path that matches the Request URL that was configured earlier
app.use('/slack/events', slackEvents.expressMiddleware());

const doSwitch = (url) => {
  if (url.includes('play.google.com')) {
    return getPlayTrackByUrl(url)
      .then(playTrack => getSpotifyURL(playTrack));
  } else if (url.includes('open.spotify.com')) {
    return getSpotifyTrackByUrl(url)
      .then(spotifyTrack => getPlayURL(spotifyTrack));
  }
  return Promise.reject(new Error('URL not supported'));
};

// Attach listeners to events by Slack Event "type". See: https://api.slack.com/events/message.im
slackEvents.on('link_shared', (event) => {
  console.log(`Received a link_shared event: user ${event.user} in channel ${event.channel}`);
  doSwitch(event.links[0].url).then((url) => {
    request({
      method: 'POST',
      uri: slackWebhookURL,
      body: {
        text: `Straight up banging tune incoming: ${url}`,
      },
      json: true,
    })
      .then(response => console.log(response))
      .catch(error => console.log(error));
  });
});

// Handle errors (see `errorCodes` export)
slackEvents.on('error', console.error);

app.post('/switch', (req, res) => {
  doSwitch(req.body.url)
    .then(track => res.send(track))
    .catch((err) => {
      console.log(err);
      res.send(err);
    });
});

// Start the express application
http.createServer(app).listen(port, () => {
  console.log(`server listening on port ${port}`);
});
