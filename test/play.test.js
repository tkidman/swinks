const chai = require('chai');
const {
  getPlayTrackByUrl,
  getPlayURL,
} = require('../src/play');

const { expect } = chai;

describe('play', function () {
  this.timeout(15000);

  context('getPlayURL', () => {
    const spotifyTrack = { name: 'Faded', type: 'track', artists: [{ name: 'Alan Walker' }] };
    it('gets the correct play track URL', () => getPlayURL(spotifyTrack)
      .then((url) => {
        expect(url).to.eql('https://play.google.com/music/m/T4vo5fyxu62sfyd4zfjwbmx4xiy?t=Faded_-_Alan_Walker');
      }));

    const spotifyAlbum = { name: 'RELAXER', type: 'album', artists: [{ name: 'Alt-J' }] };
    it('gets the correct play album URL', () => getPlayURL(spotifyAlbum)
      .then((url) => {
        expect(url).to.eql('https://play.google.com/music/m/Bis23oadmguxmndpf637yrglr7a?t=RELAXER_-_Alt-J');
      }));
  });

  context('getPlayTrackByURL', () => {
    it('gets track', () => getPlayTrackByUrl('https://play.google.com/music/m/T4vo5fyxu62sfyd4zfjwbmx4xiy?t=Faded_-_Alan_Walker')
      .then((track) => {
        expect(track.title).to.eql('Faded');
      }));

    it('gets album', () => getPlayTrackByUrl('https://play.google.com/music/m/Bis23oadmguxmndpf637yrglr7a?t=RELAXER_-_alt-J')
      .then((album) => {
        expect(album.name).to.eql('RELAXER');
      }));
  });
});
