const PlayMusic = require('playmusic');

const androidId = process.env.ANDROID_ID;
const playMasterToken = process.env.PLAY_MASTER_TOKEN;

const pm = new PlayMusic();

const initPlay = () => new Promise((resolve, reject) => {
  if (pm._settings) {
    return resolve();
  }
  return pm.init({ androidId, masterToken: playMasterToken }, (err) => {
    if (err) {
      reject(err);
    }
    resolve();
  });
});

const getPlayTrackById = tid => new Promise((resolve, reject) => {
  initPlay()
    .then(() => pm.getAllAccessTrack(tid, (err, track) => {
      if (err) {
        reject(err);
      }
      resolve(track);
    }));
});

const searchPlay = spotifyTrack => new Promise((resolve, reject) => {
  initPlay()
    .then(() => {
      pm.search(`"${spotifyTrack.name}" "${spotifyTrack.artists[0].name}"`, 5, (error, data) => { // max 5 results
        // const song = data.entries.sort((a, b) => a.score < b.score).shift(); // sort and take first song
        // console.log(song);
        if (error) {
          reject(error);
        }
        const playTrack = data.entries.find(entry => entry.type === '1').track;
        resolve(playTrack);
      });
    });
});

const getPlayURL = spotifyTrack => searchPlay(spotifyTrack)
  .then(playTrack =>
    `https://play.google.com/music/m/${playTrack.storeId}?t=${playTrack.title}_-_${playTrack.artist}`.replace(' ', '_'));

const getPlayTrackByUrl = (url) => {
  const pathTokens = url.split('?')[0].split('/');
  const tid = pathTokens[pathTokens.length - 1];
  return getPlayTrackById(tid);
};

module.exports = {
  getPlayTrackByUrl,
  getPlayURL,
};
