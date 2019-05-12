
const request = require('request');

var center = ol.proj.transform([-0.118092, 51.5074], 'EPSG:4326', 'EPSG:3857');
var view = new ol.View({
  center: center,
  zoom: 11, 
  maxZoom: 20,
  minZoom: 10
});

var layer = new ol.layer.Tile({
  source: new ol.source.OSM()
});

var map = new ol.Map({
  layers: [layer],
  target: 'map',
  view: view
});

map.on("singleclick", function (evt) {
  this.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
    window.alert(feature.get("name"));
  });
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

  addMarker: (latitude, longitude, name) => {
    var marker = new ol.Feature({
      geometry: new ol.geom.Point(
        ol.proj.fromLonLat([longitude,latitude])
      ),
      name: name
    });
    var style1 = [
      new ol.style.Style({
          image: new ol.style.Icon({
              scale: .05,
              src: "https://upload.wikimedia.org/wikipedia/commons/e/e3/Green_Dot.svg",
         }),
       zIndex: 5,
      }), 
   ];
    var vectorSource = new ol.source.Vector({
      features: [marker]
    });
    var markerVectorLayer = new ol.layer.Vector({
      source: vectorSource,
      style: function(feature, resolution) {
        return style1;
      }
    })
    map.addLayer(markerVectorLayer);
  },

  addWorkplaceMarker: (latitude, longitude, name) => {
    var marker = new ol.Feature({
      geometry: new ol.geom.Point(
        ol.proj.fromLonLat([longitude,latitude])
      ),
      name: name
    });
    var style1 = [
      new ol.style.Style({
          image: new ol.style.Icon({
              scale: .1,
              src: "https://cdn0.iconfinder.com/data/icons/business-381/500/business-work_11-512.png",
         }),
       zIndex: 5,
      }), 
   ];
    var vectorSource = new ol.source.Vector({
      features: [marker]
    });
    var markerVectorLayer = new ol.layer.Vector({
      source: vectorSource,
      style: function(feature, resolution) {
        return style1;
      }
    })
    map.addLayer(markerVectorLayer);
  },

  getPostcode: (latitude, longitude) => {
    var url = `https://api.postcodes.io/postcodes?lat=${latitude}&lon=${longitude}`;
    return new Promise((resolve, reject) => {
      request.get(url, (err, resp, body) => {
        if (err) reject(err);
        else {
          var data = JSON.parse(body);
          if (data.result && data.result.length) {
            var postcode = data.result[0];
            resolve(postcode);
          } else {
            reject(err);
          }
        }
      });
    });
  },

  getBroadband: (postcode) => {
    var url = "http://127.0.0.1:5000/broadband?postcode="+postcode;
    return new Promise((resolve, reject) => {
      request.get(url, (err, resp, body) => {
        if (err) reject(err);
        else {
          var data = JSON.parse(body);
          resolve(data);
        }
      });
    });
  },

  getMobile: (postcode) => {
    var url = "http://127.0.0.1:5000/mobile?postcode="+postcode;
    return new Promise((resolve, reject) => {
      request.get(url, (err, resp, body) => {
        if (err) reject(err);
        else {
          var data = JSON.parse(body);
          resolve(data);
        }
      });
    });
  },

  getAddress: (place,api_key) => {
    var url = `https://maps.googleapis.com/maps/api/geocode/json?address=${place}&key=${api_key}`;
    return new Promise((resolve, reject) => {
      request.get(url, (err, resp, body) => {
        if (err) reject(err);
        else {
          var data = JSON.parse(body);
          if (data != null) {
            var results = data.results;
            if (results[0].plus_code.compound_code.split(" ")[1].replace(',','') == 'London'){
              console.log("Location is in london");
              resolve(results[0]);
            }
            else{
              reject(err);
            }
          } else {
            reject(err);
          }
        }
      });
    });
  },

  getMapCenter: () =>{
    var glbox = map.getView().calculateExtent(map.getSize()); 
    var box = ol.proj.transformExtent(glbox, 'EPSG:3857', 'EPSG:4326'); 

    var center_x = (box[0]+box[2])/2;
    var center_y = (box[1]+box[3])/2;

    return new Promise((resolve) =>{
      resolve([center_y, center_x]);
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
    return new Promise((resolve, reject) => {
      request.get(url, (err, resp, body) => {
        if (err) reject(err);
        else {
          resolve(JSON.parse(body));
        }
        
      });
    });
  }
}

module.exports = d;
