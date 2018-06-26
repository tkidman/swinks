const request = require('request-promise-native');

const clientId = process.env.CLIENTID;
const clientSecret = process.env.CLIENTSECRET;

let token;

const authenticateSpotify = () => {
  if (token) {
    return Promise.resolve();
  }
  return request({
    uri: 'https://accounts.spotify.com/api/token',
    method: 'POST',
    form: 'grant_type=client_credentials',
    auth: { username: clientId, password: clientSecret },
  })
    .then((response) => {
      const res = JSON.parse(response);
      token = res.access_token;
      setTimeout(authenticateSpotify, (res.expires_in - 1) * 1000);
    })
    .catch(error => console.log(error));
};

const searchSpotifyForTrack = playTrack => authenticateSpotify()
  .then(() => {
    const query = `?q="${playTrack.title}" "${playTrack.artist}"&type=track`.replace(/ /g, '%20');
    return request({
      uri: `https://api.spotify.com/v1/search${query}`,
      auth: {
        bearer: token,
      },
      json: true,
    }).then(result => result.tracks.items[0]);
  });

const getSpotifyTrackById = id => authenticateSpotify()
  .then(() => request({
    uri: `https://api.spotify.com/v1/tracks/${id}`,
    auth: {
      bearer: token,
    },
    json: true,
  }));

const getSpotifyURL = playTrack => searchSpotifyForTrack(playTrack)
  .then(spotifyTrack => spotifyTrack.external_urls.spotify);

// https://open.spotify.com/track/7gHs73wELdeycvS48JfIos

const getSpotifyTrackByUrl = (url) => {
  const pathArray = url.split('/');
  const id = pathArray[pathArray.length - 1];
  return getSpotifyTrackById(id);
};

module.exports = {
  getSpotifyURL,
  getSpotifyTrackByUrl,
};

