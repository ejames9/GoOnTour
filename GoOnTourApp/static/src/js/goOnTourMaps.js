

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
var moment = require('moment'),
    xorCrypt = require('xor-crypt'),
    _ = require('jquery');
// __ = require('lodash');
require('leaflet');
require('mapbox.js');
require('mapbox-directions.js');
require('leaflet-markercluster');
require('leaflet-locatecontrol');

//#TODO:30 Implement Module Pattern.
var goOnTourMapsModule = (function () {

  var coords;
  var directions;
  var directionsArray = [];
  var markers;
  var cluster;
  var newDestination;
  var bool = true;
  var bool2 = true;
  var bool3 = true;
  var mapHashBool = true;

  L.mapbox.accessToken = 'pk.eyJ1IjoiZWphbWVzOSIsImEiOiIyNGNlYWUyYTU4M2Q4YTViYWM0YTBlMDRmNzIyMTYyNCJ9.RbU_-nlAAF6EOSVxj1kVMg';

  var initiateMap = function initiateMap(coordinates, data) {
    (0, _alias.log)(coordinates);(0, _alias.log)(data);
    if (coordinates === null) {
      map = L.mapbox.map('map', 'mapbox.streets-satellite').setView([45.12, -86.69], 5);
      var userLocater = L.control.locate({
        markerClass: L.circleMarker,
        locateOptions: {
          maxZoom: 8
        }
      }).addTo(map);
      userLocater.start();
      coords = coordinates;

      setTimeout(function () {
        var center = map.getCenter();
        (0, _alias.log)('center' + center);
        var coordinates = [center.lat, center.lng];
        (0, _alias.log)(coordinates);
        var userData = data;
        userData.mapData = {};
        userData.mapData.userCoordinates = coordinates;

        map.setView(coordinates);
        initializeDirectionsAPI(userData);
      }, 3000);
    } else {
      var uCoords = [coordinates[1], coordinates[0]];
      var userData = data;
      userData.mapData = {};
      userData.mapData.userCoordinates = uCoords;
      map = L.mapbox.map('map', 'mapbox.streets-satellite').setView(uCoords, 7);
      initializeDirectionsAPI(userData);
    }
    // var center = map.getCenter();
    // var coords = [center.lat, center.lng],
    //     marker = new L.Marker(coords, {
    // 	draggable: true,
    // 	    title: "I Fucking Did It!"
    // });
    // map.addLayer(marker);

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
  };

  var initializeDirectionsAPI = function initializeDirectionsAPI(userData) {
    var userCoords = userData.mapData.userCoordinates;
    var stringData = JSON.stringify(userData);
    var encrypted = xorCrypt(stringData);

    _('<input>').appendTo('#trashCan').attr('type', 'hidden').attr('id', 'data-bridge').attr('data-bridge', encrypted);

    directions = new L.mapbox.directions();
    directionsArray.push(directions);

    var directionsLayer = L.mapbox.directions.layer(directions).addTo(map);
    // var directionsInputControl = L.mapbox.directions.inputControl('inputs', directions).addTo(map);
    var directionsErrorsControl = L.mapbox.directions.errorsControl('errors', directions).addTo(map);
    var directionsRoutesControl = L.mapbox.directions.routesControl('routes', directions).addTo(map);
    var directionsInstructionsControl = L.mapbox.directions.instructionsControl('instructions', directions).addTo(map);

    directions.setOrigin(L.latLng(userCoords[0], userCoords[1])).setDestination(L.latLng(43.018217, -124.798284))
    //.addWaypoint(0, L.latLng(44.018217, -122.798284))
    .query();
  };

  var zoomBackOut = function zoomBackOut(userData) {
    map.setView(userData.mapData.currentCenter, userData.mapData.currentZoom);
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
      var newDirections = new L.mapbox.directions();
      directionsArray.unshift(newDirections);
      var directionsRoutesControl = L.mapbox.directions.routesControl('routes', directionsArray[0]).addTo(map);
      var newdirectionsLayer = L.mapmox.directions.layer(directionsArray[0], { routeStyle: { color: pathColorArray[Math.floor(Math.random() * 11)], weight: 4, opacity: 0.75 } }).addTo(map);
      directionsArray[0].setOrigin(L.latLng(newDestination)).setDestination(L.latLng(newDestination))
      //.addWaypoint(0, L.latLng(44.018217, -122.798284))
      .query();

      _eventfulData.eventfulDataModule.getData();

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

  var addGeoJsonMarkersBindEventInfo = function addGeoJsonMarkersBindEventInfo(geojson, userData) {
    userData.mapData = {};
    var mapData = userData.mapData;

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
            _conStruction.conStructionModule.displayPopupFooter(feature, artistPhotos, venuePhotos);
          };
          xhr.open('post', url);
          xhr.send(fData);
        });
        layer.on('dblclick', function (e) {
          newDestination = e.latlng;
          directionsArray[0].setDestination(newDestination).query();
          routeEngine();
        });
      }
    });
    cluster.addLayer(markers);

    map.addLayer(cluster);
    map.fitBounds(cluster.getBounds());
    (0, _alias.css)('#block').height = '80px';

    setTimeout(function () {
      var center = map.getCenter();
      var zoom = map.getZoom();

      userData.mapData.currentCenter = center;
      userData.mapData.currentZoom = zoom;
    }, 800);

    if (bool2) {
      _('#directions, #block').css('display', 'block');
      _('#mapLogo').css('opacity', '1');

      (0, _alias.log)(userData);
      _conStruction.conStructionModule.buildButtons(userData);
      bool2 = false;
    }
  };

  return {
    initMap: initiateMap,
    zoomBackOut: zoomBackOut,
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