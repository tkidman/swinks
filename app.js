const { createSlackEventAdapter } = require('@slack/events-api');
const request = require('request-promise-native');
const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const { getPlayURL, getPlayResultByUrl } = require('./src/play');
const { getSpotifyURL, getSpotifyResultByUrl } = require('./src/spotify');

const slackEvents = createSlackEventAdapter(process.env.SLACK_VERIFICATION_TOKEN);
const slackWebhookURL = process.env.SLACK_WEBHOOK_URL;
const port = process.env.PORT || 3000;

const app = express();
app.use(bodyParser.json());

const urlCache = [];

app.use('/slack/events', slackEvents.expressMiddleware());

const doSwitch = (url) => {
  if (url.includes('play.google.com')) {
    return getPlayResultByUrl(url)
      .then(playTrack => getSpotifyURL(playTrack));
  } else if (url.includes('open.spotify.com')) {
    return getSpotifyResultByUrl(url)
      .then(spotifyResult => getPlayURL(spotifyResult));
  }
  return Promise.reject(new Error('URL not supported'));
};

const postSwitchedURL = (url) => {
  const options = {
    method: 'POST',
    uri: slackWebhookURL,
    body: {
      text: url,
    },
    json: true,
  };
  return request(options);
};

slackEvents.on('link_shared', (event) => {
  console.log(`Received a link_shared event: user ${event.user} in channel ${event.channel} link: ${event.links[0].url}`);
  const eventUrl = event.links[0].url;

  if (urlCache.includes(eventUrl)) {
    console.log(`url ${eventUrl} found in cache, ignoring`);
  } else {
    urlCache.push(eventUrl);
    doSwitch(eventUrl)
      .then(url => postSwitchedURL(url))
      .then(response => console.log(response))
      .catch(error => console.log(error));
  }
});

slackEvents.on('error', console.error);

app.post('/switch', (req, res, next) => {
  doSwitch(req.body.url)
    .then(switchedUrl => res.send({ url: switchedUrl }))
    .catch((err) => {
      console.log(err);
      next(err);
    });
});

http.createServer(app).listen(port, () => {
  console.log(`server listening on port ${port}`);
});

module.exports = app;
