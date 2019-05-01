
const request = require('request');
const apikeys = require('./apikeys');

const d = {
  getOfcomInfo: (type, postcode) => {
    var options = {
      url: "https://api-proxy.ofcom.org.uk/" + type + "/coverage/" + postcode,
      headers: {
        'User-Agent': 'request',
        'Ocp-Apim-Subscription-Key': apikeys.OFCOM
      }
    };
    return new Promise((resolve, reject) => {
      request.get(options, (err, resp, body) => {
        if (err) reject(err);
        else resolve(JSON.parse(body));
      });
    });
  },

  getBroadbandInfo: (postcode) => {
    return d.getOfcomInfo('broadband', postcode);
  },

  getMobileInfo: (postcode) => {
    return d.getOfcomInfo('mobile', postcode);
  }

}

module.exports = d;
    

