const apikeys = require('./apikeys');
const google = require('@google/maps').createClient({
  key: apikeys.GOOGLE,
  Promise: Promise
});

module.exports = {
  client: google,
  f: google.directions,
  route: (origin, destination, mode) => {
    if (mode === undefined) mode = "transit";
    return google.directions({
      origin: origin,
      destination: destination,
      mode: mode
    }).asPromise();
  }
}

