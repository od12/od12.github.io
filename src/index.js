const $ = require('jquery');
const map = require('./map');
const utilities = require('./utilities');
const apikeys = require('./apikeys');
const utils = require('./utils');


map.configureOnClick((latitude, longitude) => {
  console.log(`lat:${latitude} long:${longitude}`);
  map.getPostcode(latitude, longitude);
});

map.configureOnZoom((level) => {
  console.log(`zoom:${level}`);
  //if(level>16) map.getCrimedata();
});

var input = document.getElementById('pac-input');
var searchBox = new google.maps.places.SearchBox(input);

searchBox.addListener('places_changed', function() {
  var places = searchBox.getPlaces();

  if (places.length == 0) {
    return;
  }

  var place = document.getElementById("pac-input").value;
  var place = place.split(' ').join('+');
  map.getAddress(place,apikeys.GOOGLE).then(function(result) {
    map.addWorkplaceMarker(result.geometry.location.lat, result.geometry.location.lng, document.getElementById("pac-input").value);
  }, function(err) {
    console.log(err); // Error: "It broke"
  });;
});

global.map = map.map;
global.KEYS = apikeys;
global.utils = utils;
global.$ = $;
