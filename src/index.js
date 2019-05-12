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
  if(level>17) {
    map.getMapCenter().then(function(result){
    displayPostCode(result[0], result[1]);
    });
    map.getCrimedata().then(function(result) {
      processCrimeData(result);
    }, function(err) {
      console.log(err); // Error: "It broke"
    });
  }
  else{
    utils.resetContent();
    utils.setPostcode("<i> Please zoom in further </i>");
  }
});

var input = document.getElementById('pac-input');
var searchBox = new google.maps.places.SearchBox(input);


function processHouseData(data){
  for(var i = 0; i < data.length; i++){
    map.addMarker(data[i].location.latitude, data[i].location.longitude, data[i].category);
  }
}

function processCrimeData(data){
  utils.setCrime("There are " + data.length + " crimes in this area!"); 
}

function displayPostCode(lat, long){
  map.getPostcode(lat, long).then(function(result){
    utils.setPostcode("Postcode: " + result);
    map.getBroadband(result).then(function(broadband){
      utils.setBroadband("<p> Broadband Maximum Download: " + broadband.Availability[0].MaxPredictedDown + "</p> <p> Broadband Maximum Upload: " + broadband.Availability[0].MaxPredictedUp +"</p>");
    });
    map.getMobile(result).then(function(mobile){
      utils.setMobile("EE Signal Strength: " + mobile.Availability[0].EEDataIndoor + " out of 4");
    });
  });
}

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
  });
});

global.map = map.map;
global.KEYS = apikeys;
global.utils = utils;
global.$ = $;
