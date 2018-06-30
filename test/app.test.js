const chai = require('chai');
const app = require('../app.js');
const request = require('supertest');

const { expect } = chai;

describe('app', function () {
  this.timeout(15000);

  context('switches', () => {
    it('switches spotify track', () => request(app)
      .post('/switch')
      .send({ url: 'https://open.spotify.com/track/7gHs73wELdeycvS48JfIos' })
      .expect(200)
      .then((response) => {
        expect(response.body.url).to.eql('https://play.google.com/music/m/T4vo5fyxu62sfyd4zfjwbmx4xiy?t=Faded_-_Alan_Walker');
      }));

    it('switches spotify album', () => request(app)
      .post('/switch')
      .send({ url: 'https://open.spotify.com/album/3mH6qwIy9crq0I9YQbOuDf?si=A3_UZmRzThOaw0HGGkMktg' })
      .expect(200)
      .then((response) => {
        expect(response.body.url).to.eql('https://play.google.com/music/m/B2pyrl2zzxs6cz6x2nwsb6h7imq?t=Blonde_-_Frank_Ocean');
      }));

    it('switches play track', () => request(app)
      .post('/switch')
      .send({ url: 'https://play.google.com/music/m/T4vo5fyxu62sfyd4zfjwbmx4xiy?t=Faded_-_Alan_Walker' })
      .expect(200)
      .then((response) => {
        expect(response.body.url).to.eql('https://open.spotify.com/track/7gHs73wELdeycvS48JfIos');
      }));

    it('switches play album', () => request(app)
      .post('/switch')
      .send({ url: 'https://play.google.com/music/m/Bis23oadmguxmndpf637yrglr7a?t=RELAXER_-_alt-J' })
      .expect(200)
      .then((response) => {
        expect(response.body.url).to.eql('https://open.spotify.com/album/3uHMSQ1cC1fFAi4WMnelQP');
      }));

    it('handles an error', () => request(app)
      .post('/switch')
      .send({ url: 'https://play.google.com/music/m/B123?t=RELAXER_-_alt-J' })
      .expect(500)
      .then((err) => {
        expect(err.text.includes('Error: error getting album tracks: Error: 400 error from server')).to.eql(true);
      }));
  });
});
