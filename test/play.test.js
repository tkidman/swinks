const chai = require('chai');
const {
  getPlayTrackByUrl,
  getPlayURL,
  switchSpotify,
} = require('../src/play');

const { expect } = chai;

describe('play', function () {
  this.timeout(15000);

  context('getPlayURL', () => {
    const spotifyTrack = { name: 'Faded', artists: [{ name: 'Alan Walker' }] };
    it('gets the correct play URL', () => getPlayURL(spotifyTrack)
      .then((url) => {
        expect(url).to.eql('https://play.google.com/music/m/T4vo5fyxu62sfyd4zfjwbmx4xiy?t=Faded_-_Alan_Walker');
      }));
  });

  context('getPlayTrackByURL', () => {
    it('gets track', () => getPlayTrackByUrl('https://play.google.com/music/m/T4vo5fyxu62sfyd4zfjwbmx4xiy?t=Faded_-_Alan_Walker')
      .then((track) => {
        expect(track.title).to.eql('Faded');
      }));
  });

  context('switchSpotify', () => {
    it('switches', () => switchSpotify('https://open.spotify.com/track/7gHs73wELdeycvS48JfIos')
      .then((url) => {
        expect(url).to.eql('https://play.google.com/music/m/T4vo5fyxu62sfyd4zfjwbmx4xiy?t=Faded_-_Alan_Walker');
      }));
  });
});
