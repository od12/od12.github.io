const Zoopla = require('zoopla');
const apikeys = require('./apikeys');
const zoopla = new Zoopla({ apiKey: apikeys.ZOOPLA });

module.exports = zoopla;

