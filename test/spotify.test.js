const chai = require('chai');
const {
  getSpotifyURL,
  getSpotifyTrackByUrl,
} = require('../src/spotify');

const { expect } = chai;

describe('spotify', function () {
  this.timeout(15000);
  context('getSpotifyURL', () => {
    it('gets the correct spotify URL', () => getSpotifyURL({ title: 'Faded', artist: 'Alan Walker' })
      .then((url) => {
        expect(url).to.eql('https://open.spotify.com/track/7gHs73wELdeycvS48JfIos');
      }));
  });

  context('getSpotifyTrackByUrl', () => {
    it('gets the track', () => getSpotifyTrackByUrl('https://open.spotify.com/track/7gHs73wELdeycvS48JfIos')
      .then((track) => {
        expect(track.name).to.eql('Faded');
      }));
  });
});
