
const request = require('request');

var center = ol.proj.transform([-0.118092, 51.5074], 'EPSG:4326', 'EPSG:3857');
var view = new ol.View({
  center: center,
  zoom: 11
});

var layer = new ol.layer.Tile({
  source: new ol.source.OSM()
});

var map = new ol.Map({
  layers: [layer],
  target: 'map',
  view: view
});

const d = {
  map: map,

  configureOnClick: (cb) => {
    map.on('click', (evt) => {
      var coord = map.getCoordinateFromPixel(evt.pixel);
      var longitude = ol.proj.toLonLat(coord)[0];
      var latitude = ol.proj.toLonLat(coord)[1];

      cb(latitude, longitude);
    });
  },

  configureOnZoom: (cb) => {
    map.on('moveend', (evt) => {
      var zoom = map.getView().getZoom();
      cb(zoom);
    });
  },

  getPostcode: (latitude, longitude) => {
    var url = `https://api.postcodes.io/postcodes?lat=${latitude}&lon=${longitude}`;
    return new Promise((resolve, reject) => {
      request.get(url, (err, resp, body) => {
        if (err) reject(err);
        else {
          var data = JSON.parse(body);
          if (data.result && data.result.length) {
            var postcode = data.result[0].postcode;
            console.log(`Found postcode: ${postcode}`);
            resolve(postcode);
          } else {
            reject(err);
          }
        }
      });
    });
  },

  getAddress: (api_key) => {
    var url = `https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=${api_key}`;
    return new Promise((resolve, reject) => {
      request.get(url, (err, resp, body) => {
        if (err) reject(err);
        else {
          var data = JSON.parse(body);
          if (data.result && data.result.length) {
            var postcode = data.result[0].postcode;
            console.log(`Found postcode: ${postcode}`);
            resolve(postcode);
          } else {
            reject(err);
          }
        }
      });
    });
  },

  getCrimedata: () => {
    var glbox = map.getView().calculateExtent(map.getSize()); 
    var box = ol.proj.transformExtent(glbox, 'EPSG:3857', 'EPSG:4326'); 
    //Convert extent to coordinates for polygon
    //bottom left = box[0] and box[1]
    //bottom right = box[2] and box[1]
    //top left = box[0] and box[3]
    //top right = box[2] and box[3] 
    var bl = `${box[1]},${box[0]}`;
    var br = `${box[1]},${box[2]}`;
    var tl = `${box[3]},${box[0]}`;
    var tr = `${box[3]},${box[2]}`;
    const url = `https://data.police.uk/api/crimes-street/all-crime?poly=${bl}:${br}:${tl}:${tr}`;
    //console.log(url);
    return new Promise((resolve, reject) => {
      request.get(url, (err, resp, body) => {
        if (err) reject(err);
        else resolve(JSON.parse(body));
      });
    });
  }
}

module.exports = d;
