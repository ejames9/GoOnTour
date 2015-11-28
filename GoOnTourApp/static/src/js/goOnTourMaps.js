

// goOnTourMaps.js Module for GoOnTour.org. Deals mainly with Map Instantiation and Manipulation.
//myJS, ES6 Style
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _alias = require('./alias');

var _conStruction = require('./conStruction');

var _eventfulData = require('./eventfulData');

var _homeSlice = require('./homeSlice');

//CommonJS Modules
require('leaflet');
var moment = require('moment');
require('mapbox.js');
require('mapbox-directions.js');

// var map;

//#TODO:30 Implement Module Pattern.
var goOnTourMapsModule = (function () {

  var coords;
  var directions;
  var directionsArray = [];
  var markers;
  var cluster;
  var center;
  var zoom;
  var newDestination;
  var bool = true;
  var bool2 = true;
  var bool3 = true;
  var mapHashBool = true;

  L.mapbox.accessToken = 'pk.eyJ1IjoiZWphbWVzOSIsImEiOiIyNGNlYWUyYTU4M2Q4YTViYWM0YTBlMDRmNzIyMTYyNCJ9.RbU_-nlAAF6EOSVxj1kVMg';

  var getUserLatLng = function getUserLatLng(position) {
    coords = [position.coords.longitude, position.coords.latitude];
    bool3 = false;
    console.log(coords);
    initMap(coords);
  };

  var getUserCoordinates = function getUserCoordinates() {
    map = L.mapbox.map('map', 'mapbox.streets-satellite').setView([45.12, -86.69], 5);
    if (navigator.geolocation) {
      // Needs Cross-Browser Support
      (0, _alias.log)('log 4');
      navigator.geolocation.getCurrentPosition(getUserLatLng);
    }
  };

  var initMap = function initMap(coords) {
    (0, _alias.log)('init1');
    if (mapHashBool === true) {
      window.location.hash = '#map';
      mapHashBool = false;
    }
    var uCoords = [coords[1], coords[0]];
    (0, _alias.log)(uCoords);
    if (bool3) {
      // var key = 'pk.eyJ1IjoiZWphbWVzOSIsImEiOiIyNGNlYWUyYTU4M2Q4YTViYWM0YTBlMDRmNzIyMTYyNCJ9.RbU_-nlAAF6EOSVxj1kVMg';
      // mapBox.accessToken = key;
      map = L.mapbox.map('map', 'mapbox.streets-satellite').setView(uCoords, 7);
    } else {
      map.setView(uCoords, 7);
    }

    var marker = new L.Marker(uCoords, {
      draggable: true,
      title: "I Fucking Did It manualDispatchChangeEvent!"
    });
    map.addLayer(marker);

    (0, _alias.on)('click', '#submit', _eventfulData.eventfulDataModule.getData);
    (0, _alias.on)('click', '#menu', _conStruction.conStructionModule.buildMenus);

    // window.onhashchange = function() {
    // 		log('hashChange');
    // 		if (window.location.hash === '') {
    // 			log('reload');
    // 			Construct.homeReload();
    // 		} else if (window.location.hash == '#map') {
    // 			log(Construct.forHash);
    // 			if (Construct.forHash === 0) {
    // 				Construct.loadMap(0);
    // 			} else {
    // 				log(coords);
    // 				Construct.loadMap(coords);
    // 			}
    // 		}
    //  };
    // //  initCalendars();
  };

  var zoomBackOut = function zoomBackOut() {
    map.setView(center, zoom);
  };

  var reRouteEngine = function reRouteEngine() {};

  var routeEngine = function routeEngine() {
    var dateArray = [_eventfulData.eventfulDataModule.startDate, _eventfulData.eventfulDataModule.endDate];(0, _alias.log)(dateArray);
    var startDate = dateArray[0];
    startDate = moment(startDate, 'MM-DD-YYYY');
    startDate = moment(startDate).add(1, 'days').format('MM-DD-YYYY');
    startDate = startDate.toString();
    (0, _alias.log)(dateArray[0], dateArray[1]);
    if (dateArray[0] != dateArray[1]) {
      var newDirections = new mapBox.directions();
      directionsArray.unshift(newDirections);
      var directionsRoutesControl = mapBox.directions.routesControl('routes', directionsArray[0]).addTo(map);
      var newdirectionsLayer = mapBox.directions.layer(directionsArray[0], { routeStyle: { color: pathColorArray[Math.floor(Math.random() * 11)], weight: 4, opacity: 0.75 } }).addTo(map);
      directionsArray[0].setOrigin(L.latLng(newDestination)).setDestination(L.latLng(newDestination))
      //.addWaypoint(0, L.latLng(44.018217, -122.798284))
      .query();

      getData();

      map.removeLayer(cluster);
      markerArray = [];
    } else {
      (0, _alias.dom)('#engineButton').id = 'killButton';
      (0, _alias.dom)('#engineButton2').id = 'killButton2';
      (0, _alias.dom)('#zoomBackButton').id = 'killButton3';
      (0, _alias.css)('#directions').width = '20px';
      map.removeLayer(cluster);
    }
  };

  var addGeoJsonMarkersBindEventInfo = function addGeoJsonMarkersBindEventInfo(geojson) {
    cluster = new L.MarkerClusterGroup();
    var markerStyle = {
      draggable: false,
      icon: L.mapbox.marker.icon({
        'marker-size': '',
        'marker-color': '#444',
        'marker-symbol': 'music'
      })
    };
    markers = new L.geoJson(geojson, {
      pointToLayer: function pointToLayer(feature, latlng) {
        return L.marker(latlng, markerStyle);
      },
      onEachFeature: function onEachFeature(feature, layer) {
        layer.bindPopup('<h2>' + feature.properties.title + '</h2><br /><p>Performing at: <b>' + feature.properties.venueName + '</b><br />in <b>' + feature.properties.cityName + '</b>');
        layer.on('popupclose', function () {
          _conStruction.conStructionModule.closeFooterAndKillPics();
        });
        layer.on('click', function (e) {
          var xhr = new XMLHttpRequest();
          var fData = new FormData();
          var url = '/api_flickr_query/';

          fData.append('title', feature.properties.title);
          fData.append('venue', feature.properties.venueName);
          fData.append('city', feature.properties.cityName);

          xhr.onloadend = function () {
            var jsonArray = JSON.parse(this.responseText);
            var artistPhotos = JSON.parse(jsonArray[0]);
            var venuePhotos = JSON.parse(jsonArray[1]);
            console.log(artistPhotos);
            console.log(venuePhotos);
            displayFlickrPhotos(artistPhotos, venuePhotos);
          };
          xhr.open('post', url);
          xhr.send(fData);
        });
        layer.on('dblclick', function (e) {
          newDestination = e.latlng;
          directionsArray[0].setDestination(newDestination).query();
        });
      }
    });
    cluster.addLayer(markers);
    map.addLayer(cluster);
    map.fitBounds(cluster.getBounds());
    (0, _alias.css)('#block').height = '80px';

    setTimeout(function () {
      center = map.getCenter();
      zoom = map.getZoom();
    }, 800);

    if (bool2) {
      buildButtons();
      bool2 = false;
    }
  };

  return {
    getUser: getUserCoordinates,
    initMap: initMap,
    zoomOut: zoomBackOut,
    routeEngine: routeEngine,
    toMap: addGeoJsonMarkersBindEventInfo,
    bool: bool
  };
})();

exports.goOnTourMapsModule = goOnTourMapsModule;
//#DONE:0 Upload Photos
//#DOING:0 Sell iPhone
//#TODO:10 Order new iPhone
//NOTE I like this.