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

const getPlayTrackById = id => new Promise((resolve, reject) => {
  initPlay()
    .then(() => pm.getAllAccessTrack(id, (err, track) => {
      if (err) {
        reject(err);
      }
      resolve(track);
    }));
});

const getPlayAlbumById = id => new Promise((resolve, reject) => {
  initPlay()
    .then(() => pm.getAlbum(id, false, (err, album) => {
      if (err) {
        reject(err);
      }
      resolve(album);
    }));
});

const searchPlayForTrack = spotifyTrack => new Promise((resolve, reject) => {
  initPlay()
    .then(() => {
      pm.search(`"${spotifyTrack.name}" "${spotifyTrack.artists[0].name}"`, 5, (error, data) => {
        if (error) {
          reject(error);
        }
        const playTrack = data.entries.find(entry => entry.type === '1').track;
        resolve(playTrack);
      });
    });
});

const searchPlayForAlbum = spotifyAlbum => new Promise((resolve, reject) => {
  initPlay()
    .then(() => {
      pm.search(`"${spotifyAlbum.name}" "${spotifyAlbum.artists[0].name}"`, 5, (error, data) => {
        if (error) {
          reject(error);
        }
        const playAlbum = data.entries.find(entry => entry.type === '3').album;
        resolve(playAlbum);
      });
    });
});

const getPlayURL = (spotifyResult) => {
  if (spotifyResult.type === 'album') {
    return searchPlayForAlbum(spotifyResult)
      .then(playAlbum =>
        `https://play.google.com/music/m/${playAlbum.albumId}?t=${playAlbum.name}_-_${playAlbum.artist}`.replace(/ /g, '_'));
  }
  return searchPlayForTrack(spotifyResult)
    .then(playTrack =>
      `https://play.google.com/music/m/${playTrack.storeId}?t=${playTrack.title}_-_${playTrack.artist}`.replace(/ /g, '_'));
};

const getPlayResultByUrl = (url) => {
  const pathTokens = url.split('?')[0].split('/');
  const id = pathTokens[pathTokens.length - 1];
  if (id[0] === 'B') {
    return getPlayAlbumById(id);
  }
  return getPlayTrackById(id);
};

module.exports = {
  getPlayResultByUrl,
  getPlayURL,
};
