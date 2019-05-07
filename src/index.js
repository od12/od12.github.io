const $ = require('jquery');
const map = require('./map');
const utilities = require('./utilities');
const apikeys = require('./apikeys');
const utils = require('./utils');


map.configureOnClick((latitude, longitude) => {
  console.log(`lat:${latitude} long:${longitude}`);
  map.getPostcode(latitude, longitude);
  console.log(apikeys.GOOGLE);
  map.getAddress(apikeys.GOOGLE);
  console.log(utilities.getMobileInfo("SO171UJ"));
});

map.configureOnZoom((level) => {
  console.log(`zoom:${level}`);
});


global.map = map.map;
global.KEYS = apikeys;
global.utils = utils;
global.$ = $;
