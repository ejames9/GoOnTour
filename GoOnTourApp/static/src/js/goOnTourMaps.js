

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

var _threeDGraphics = require('./threeDGraphics');

//CommonJS Modules
var moment = require('moment'),
    React = require('react/addons'),
    xorCrypt = require('xor-crypt'),
    _ = require('jquery');
// __ = require('lodash');
require('leaflet');
require('mapbox.js');
//  require('mapbox-gl');
//  require('mapbox-gl-leaflet');
require('mapbox-directions.js');
require('leaflet-markercluster');
require('leaflet-locatecontrol');
require('./node_modules/three.js/build/CSS3DRenderer');

//#DONE:50 Implement Module Pattern.
var goOnTourMapsModule = (function () {

  //"Global" variables of the module namespace.
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
  var pathColorArray = ['#58292a', '#fdfca5', '#5c4c59', '#7bb64b', '#f5be57', '#091423', '#cd552d', '#d9e7f1', '#2b86f3', '#0d6711', '#662e7f'];

  L.mapbox.accessToken = 'pk.eyJ1IjoiZWphbWVzOSIsImEiOiIyNGNlYWUyYTU4M2Q4YTViYWM0YTBlMDRmNzIyMTYyNCJ9.RbU_-nlAAF6EOSVxj1kVMg';
  // var mapBoxGLToken = 'pk.eyJ1IjoiZWphbWVzOSIsImEiOiIyNGNlYWUyYTU4M2Q4YTViYWM0YTBlMDRmNzIyMTYyNCJ9.RbU_-nlAAF6EOSVxj1kVMg';

  //Map initiation function, is called by loadMap function in the conStruction module. The function is called either with lat, lng coordinates
  //grabbed by the geocoder, or with this argument null, with intent to get lat, lng from geolocation API. The second argument is userData that is being
  //passed from function to function. At this point, data has no properties.

  var initiateMap = function initiateMap(coordinates, data) {
    //set map variable here instead of in module namespace, so that .call() functions below will work as needed.
    var map;
    (0, _alias.log)('initMap');(0, _alias.log)(coordinates);(0, _alias.log)(data);
    (0, _alias.kill)('.lines');
    if (coordinates === null) {
      _threeDGraphics.threeDModule.threeDMap.call(this, coordinates); //Calling ThreeDMap() and render() functions from the threeDGraphics module
      _threeDGraphics.threeDModule.render.call(this); //in the context of initiateMap function object.
      var map = this.map;
      window.map = map; //Setting this.map to Global namespace.
      (0, _alias.log)('map');(0, _alias.log)(this);

      // map.scrollWheelZoom.disable();
      (0, _alias.log)('center');(0, _alias.log)(map.getCenter());

      var userLocater = L.control.locate({ //Instantiate leaflet-locatecontrol plugin for use of the geolocation API. Add it to map. May
        markerClass: L.circleMarker, //want to roll my own here, as it would eliminate the need for the setTimeout below.
        locateOptions: { //TODO: Refactor user location code, using HTML5 geolocation API directly.
          maxZoom: 8
        }
      }).addTo(map);
      userLocater.start(); //Start geolocation plugin,
      setTimeout(function () {
        //Wait 1 second,
        onLocationFound(data); //Call onLocationFound() function with userData, which still has no properties.
      }, 1000);
    } else {
      //If Construct.loadMap() calls this function with coordinates, above code is skipped for below.
      var uCoords = [coordinates[1], coordinates[0]]; //Reverse lat, lng.
      var userData = {};
      userData.mapData = {}; //Finally, some userData.
      userData.mapData.userCoordinates = uCoords;
      (0, _alias.log)(['udata', userData]);
      _threeDGraphics.threeDModule.threeDMap(coordinates);
      _threeDGraphics.threeDModule.render();

      map.scrollWheelZoom.disable();
      // initializeDirectionsAPI(userData);
    }
    // var center = map.getCenter();
    // var coords = [center.lat, center.lng],
    //     marker = new L.Marker(coords, {
    // 	draggable: true,
    // 	    title: "I Fucking Did It!"
    // });
    // map.addLayer(marker);

    (0, _alias.on)('click', '#menu', _conStruction.conStructionModule.buildMenus); //Event listener. When clicked, map navigation buttons are built.

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

  var onLocationFound = function onLocationFound(data) {
    //Called by initiateMap() function with propertyless data object, in the hopes that
    var coordinates,
        //the leaflet-locatecontrol plugin module will have set dataBridgeID with database key of the lat, lng. If if hasn't
    lattitude,
        //the HTTP Request below will error, and the coordinates will not be retrieved.
    longitude,
        dBID = window.dataBridgeID;(0, _alias.log)('onFound');(0, _alias.log)(data);(0, _alias.log)(dBID);
    var url = '/api_search_parameters/',
        fd = new FormData();
    fd.append('function', 1);
    fd.append('id', dBID);

    coordinates = (0, _alias.xhr)(fd, url);(0, _alias.log)('coordinates');(0, _alias.log)(coordinates); //Retrieve user coordinates from userData in database.

    longitude = coordinates.longitude;
    lattitude = coordinates.lattitude;(0, _alias.log)([lattitude, longitude]);

    var userData = data; //Set user coordinates in userData.
    userData.mapData = {};
    userData.mapData.userCoordinates = [lattitude, longitude];
    map.setView([lattitude, longitude], 7); //Set map to user coordinates, zoom level 7.

    initializeDirectionsAPI(userData); //Once map is set up, initialize the Directions API. Disabling this for now, as part of
  }; //temporarily cauterizing the application, for search functionality only.

  var initializeDirectionsAPI = function initializeDirectionsAPI(userData) {
    var userCoords = userData.mapData.userCoordinates; //This will be replaced by the database userData model when this function is reincorporated into
    var stringData = JSON.stringify(userData); //the application. The data is essentially being encrypted and attached to a DOM Element, to be
    var encrypted = xorCrypt(stringData); //retrieved in the showSearchOperations() function/space.

    _('<input>').appendTo('#trashCan').attr('type', 'hidden').attr('id', 'data-bridge').attr('data-bridge', encrypted);

    directions = new L.mapbox.directions(); //The Mapbox Directions API is instantiated and added to map.
    directionsArray.push(directions);

    var directionsLayer = L.mapbox.directions.layer(directions).addTo(map);
    // var directionsInputControl = L.mapbox.directions.inputControl('inputs', directions).addTo(map);
    var directionsErrorsControl = L.mapbox.directions.errorsControl('errors', directions).addTo(map);
    var directionsRoutesControl = L.mapbox.directions.routesControl('routes', directions).addTo(map);
    var directionsInstructionsControl = L.mapbox.directions.instructionsControl('instructions', directions).addTo(map);

    directions //Set origin of Directios API.
    .setOrigin(L.latLng(userCoords[0], userCoords[1]))
    //.setDestination(L.latLng(43.018217, -124.798284))
    //.addWaypoint(0, L.latLng(44.018217, -122.798284))
    .query();
  };

  //This is the handleClick callback function for the reactFlickrPopupFooter "Route" button.  It removes the react app, closes the footer and
  //stops the regeneration of photos, sets the marker location as the Destination of the current Directions layer and calls The
  //routeEngine() function with datum as argument. Datum is userData.
  var addDestinationToRoute = function addDestinationToRoute(datum, coords) {
    _('#react-app').remove();
    _conStruction.conStructionModule.closeFooterAndKillPics();
    newDestination = L.latLng(coords[1], coords[0]);
    directionsArray[0].setDestination(newDestination).query();
    routeEngine(datum);
  };

  //This function is the callback for an eventlistener on one of the map navigation buttons. It uses currentCenter and currentZoom properties
  //of userData.mapData to return the user to a preset center and map zoom, if the user gets lost somewhere in the map.
  var zoomBackOut = function zoomBackOut(userData) {
    map.setView(userData.mapData.currentCenter, userData.mapData.currentZoom);
  };

  //Unwritten function. Will essentially be the opposite of routeEngine, erasing the current Directions layer, and returning to the previous.
  var reRouteEngine = function reRouteEngine() {};

  //
  var routeEngine = function routeEngine(datum) {
    var u = datum.searchParameters;
    var dateArray = [u.startDate, u.endDate];(0, _alias.log)(dateArray);
    var startDate = dateArray[0];
    startDate = moment(startDate, 'MM-DD-YYYY');
    startDate = moment(startDate).add(1, 'days').format('MM-DD-YYYY');
    startDate = startDate.toString();
    (0, _alias.log)(dateArray[0], dateArray[1]);
    if (dateArray[0] != dateArray[1]) {
      var newDirections = new L.mapbox.directions();
      directionsArray.unshift(newDirections);
      var directionsRoutesControl = L.mapbox.directions.routesControl('routes', directionsArray[0]).addTo(map);
      var newdirectionsLayer = L.mapbox.directions.layer(directionsArray[0], { routeStyle: { color: pathColorArray[Math.floor(Math.random() * 11)], weight: 4, opacity: 0.75 } }).addTo(map);
      directionsArray[0].setOrigin(L.latLng(newDestination)).setDestination(L.latLng(newDestination))
      //.addWaypoint(0, L.latLng(44.018217, -122.798284))
      .query();

      _eventfulData.eventfulDataModule.getData(datum);

      map.removeLayer(cluster);
      markers = [];
    } else {
      (0, _alias.dom)('#engineButton').id = 'killButton';
      (0, _alias.dom)('#engineButton2').id = 'killButton2';
      (0, _alias.dom)('#zoomBackButton').id = 'killButton3';
      (0, _alias.css)('#directions').width = '20px';
      map.removeLayer(cluster);
    }
  };

  var checkinShitOut = function checkinShitOut(geojson) {
    (0, _alias.log)('json');(0, _alias.log)(geojson[0].geometry.coordinates);
    var coords = geojson[0].geometry.coordinates;
    var coords2 = geojson[1].geometry.coordinates;
    var coords3 = [geojson[0].geometry.coordinates[1], geojson[0].geometry.coordinates[0]];
    var pixCoords = map.unproject(coords);
    var pixCoords2 = map.latLngToLayerPoint(coords2);
    var pixCoords3 = map.latLngToContainerPoint(coords3);
    (0, _alias.log)(pixCoords);(0, _alias.log)(pixCoords2);(0, _alias.log)(pixCoords3);
  };

  var addGeoJsonMarkersBindEventInfo = function addGeoJsonMarkersBindEventInfo(geojson, userData) {
    checkinShitOut(geojson);
    userData.mapData = {};
    var mapData = userData.mapData;

    cluster = new L.MarkerClusterGroup();
    var myIcon = L.divIcon({
      className: '',
      html: '<div class="marker"><i class="fa fa-music fa-1x" id="mus"></i></div>', //<img src="/static/build/images/showMarker2.png"/>
      iconSize: [2, 4]
    });
    var markerStyle = {
      draggable: false,
      icon: myIcon
    };
    // var markerStyle = {
    // 	color: '#e8de43',
    //   opacity: 1,
    //   fillColor: '#eb3e4e',
    //   fillOpacity: 1
    // };
    markers = new L.geoJson(geojson, {
      pointToLayer: function pointToLayer(feature, latlng) {
        return L.marker(latlng, markerStyle);
      },
      onEachFeature: function onEachFeature(feature, layer) {
        layer.bindPopup('<h2>' + feature.properties.title + '</h2><br /><p>Performing at: <b>' + feature.properties.venueName + '</b><br />in <b>' + feature.properties.venueCity + ', ' + feature.properties.stateAbbr + '</b>');
        layer.on('popupclose', function () {
          _('#react-app').remove();
          _conStruction.conStructionModule.closeFooterAndKillPics();
        });
        layer.on('click', function (e) {
          (0, _alias.log)('e');(0, _alias.log)(e);
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
            (0, _alias.log)('uDataYo');
            console.log(userData);
            _conStruction.conStructionModule.displayPopupFooter(feature, artistPhotos, venuePhotos, userData);
          };
          xhr.open('post', url);
          xhr.send(fData);
        });
      }
    });

    cluster.addLayer(markers);
    map.addLayer(cluster);
    map.fitBounds(cluster.getBounds());
    map.setZoom(5);
    (0, _alias.css)('#block').height = '80px';

    setTimeout(function () {
      var center = map.getCenter();
      var zoom = map.getZoom();
      _threeDGraphics.threeDModule.threeDMarkers();

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
    addDestination: addDestinationToRoute,
    userFound: onLocationFound,
    bool: bool
  };
})();

exports.goOnTourMapsModule = goOnTourMapsModule;
//#DONE:60 Upload Photos
//#DONE:20 Sell iPhone
//#DONE:40 Order new iPhone

//DONE:0 Circle Music markers
//DOING:0 New Popups
//TODO:0 Fallback 2D view
//TODO:10 List View for Results (Markers, Center When Clicked)
//FIXME: Center Clusters at High Zoom level (Help Find)
//TODO:20 Well Defined Explore and Routing Interfaces