

// goOnTourMaps.js Module for GoOnTour.org. Deals mainly with Map Instantiation and Manipulation.
//myJS, ES6 Style
import { dom, css, on, log, xhr, kill, forFun } from './alias';
import { conStructionModule as Construct } from './conStruction';
import { eventfulDataModule as Events } from './eventfulData';
import { homeSliceModule as Home } from './homeSlice';
import { threeDModule as ThreeD } from './threeDGraphics';


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
export const goOnTourMapsModule = (function() {


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
  var pathColorArray = ['#58292a', '#fdfca5', '#5c4c59', '#7bb64b', '#f5be57', '#091423', '#cd552d','#d9e7f1', '#2b86f3', '#0d6711', '#662e7f'];


  L.mapbox.accessToken = 'pk.eyJ1IjoiZWphbWVzOSIsImEiOiIyNGNlYWUyYTU4M2Q4YTViYWM0YTBlMDRmNzIyMTYyNCJ9.RbU_-nlAAF6EOSVxj1kVMg';
  // var mapBoxGLToken = 'pk.eyJ1IjoiZWphbWVzOSIsImEiOiIyNGNlYWUyYTU4M2Q4YTViYWM0YTBlMDRmNzIyMTYyNCJ9.RbU_-nlAAF6EOSVxj1kVMg';

  var initiateMap = function(coordinates, data) {
    var map;
    log('initMap'); log(coordinates); log(data);
    kill('.lines');
    if (coordinates === null) {
      ThreeD.threeDMap.call(this, coordinates);
      ThreeD.render.call(this);
      var map = this.map;
      window.map = map;
      log('map'); log(this);

      // map.scrollWheelZoom.disable();
      log('center'); log(map.getCenter());

      var userLocater = L.control.locate({
        markerClass: L.circleMarker,
        locateOptions: {
          maxZoom: 8
        }
      }).addTo(map);
      userLocater.start();
      setTimeout(function() {
        onLocationFound(data);
      }, 1000);
    } else {
      var uCoords = [coordinates[1], coordinates[0]];
      var userData = {};
          userData.mapData = {};
          userData.mapData.userCoordinates = uCoords;
          log(['udata', userData]);
          ThreeD.threeDMap(coordinates);
          ThreeD.render();

          map.scrollWheelZoom.disable();
          initializeDirectionsAPI(userData);
    }
    // var center = map.getCenter();
    // var coords = [center.lat, center.lng],
    //     marker = new L.Marker(coords, {
  	// 	draggable: true,
  	// 	    title: "I Fucking Did It!"
  	// });
  	// map.addLayer(marker);

  	on('click', '#menu', Construct.buildMenus);

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

  var onLocationFound = function(data) {
    var coordinates,
        lattitude,
        longitude,
             dBID = window.dataBridgeID;                               log('onFound'); log(data); log(dBID);
    var url = '/api_search_parameters/',
         fd = new FormData();
         fd.append('function', 1);
         fd.append('id', dBID);

    coordinates = xhr(fd, url);                 log('coordinates'); log(coordinates); log(map);

    longitude = coordinates.longitude;
    lattitude = coordinates.lattitude;                          log([lattitude, longitude]);


    var userData = data;
        userData.mapData = {};
        userData.mapData.userCoordinates = [lattitude, longitude];
        map.setView([lattitude, longitude], 7);

        initializeDirectionsAPI(userData);
  };


  var initializeDirectionsAPI = function(userData) {
    var userCoords = userData.mapData.userCoordinates;
    var stringData = JSON.stringify(userData);
    var encrypted  = xorCrypt(stringData);

        _('<input>')
                .appendTo('#trashCan')
                .attr('type', 'hidden')
                .attr('id', 'data-bridge')
                .attr('data-bridge', encrypted);

        directions = new L.mapbox.directions();
        directionsArray.push(directions);

    var directionsLayer = L.mapbox.directions.layer(directions)
                                                             .addTo(map);
    // var directionsInputControl = L.mapbox.directions.inputControl('inputs', directions).addTo(map);
    var directionsErrorsControl = L.mapbox.directions.errorsControl('errors', directions).addTo(map);
    var directionsRoutesControl = L.mapbox.directions.routesControl('routes', directions).addTo(map);
    var directionsInstructionsControl = L.mapbox.directions.instructionsControl('instructions', directions).addTo(map);

    directions
        .setOrigin(L.latLng(userCoords[0], userCoords[1]))
      //.setDestination(L.latLng(43.018217, -124.798284))
      //.addWaypoint(0, L.latLng(44.018217, -122.798284))
        .query();
  };


  var addDestinationToRoute = function(datum, coords) {
    _('#react-app')
             .remove();
    Construct.closeFooterAndKillPics();
    newDestination = L.latLng(coords[1], coords[0]);
    directionsArray[0]
    						.setDestination(newDestination)
    						.query();
      routeEngine(datum);
  };



  var zoomBackOut = function(userData) {
    map.setView(userData.mapData.currentCenter, userData.mapData.currentZoom);
  };

  var reRouteEngine = function() {};

  var routeEngine = function(datum) {
    var u         = datum.searchParameters;
    var dateArray = [u.startDate, u.endDate]; log(dateArray);
  	var startDate = dateArray[0];
  	    startDate = moment(startDate, 'MM-DD-YYYY');
  	    startDate = moment(startDate).add(1, 'days').format('MM-DD-YYYY');
  	    startDate = startDate.toString();
  	    log(dateArray[0], dateArray[1]);
  	if (dateArray[0] != dateArray[1]) {
  		var	newDirections = new L.mapbox.directions();
  			  directionsArray.unshift(newDirections);
  		var directionsRoutesControl = L.mapbox.directions.routesControl('routes', directionsArray[0])
  																																													.addTo(map);
  		var newdirectionsLayer = L.mapbox.directions.layer(directionsArray[0], {routeStyle: {color: pathColorArray[Math.floor(Math.random() * 11)], weight: 4, opacity: 0.75}})
  																																																	.addTo(map);
  		directionsArray[0]
  				    .setOrigin(L.latLng(newDestination))
  				    .setDestination(L.latLng(newDestination))
  		      //.addWaypoint(0, L.latLng(44.018217, -122.798284))
  				    .query();


  		Events.getData(datum);

  		map.removeLayer(cluster);
  		markers = [];
  	} else {
  		dom('#engineButton').id = 'killButton';
  		dom('#engineButton2').id = 'killButton2';
  		dom('#zoomBackButton').id = 'killButton3';
  		css('#directions').width = '20px';
  		map.removeLayer(cluster);
  	}
  };

  var checkinShitOut = function(geojson) {
    log('json'); log(geojson[0].geometry.coordinates);
    var coords = geojson[0].geometry.coordinates;
    var coords2 = geojson[1].geometry.coordinates;
    var coords3 = [geojson[0].geometry.coordinates[1], geojson[0].geometry.coordinates[0]];
    var pixCoords = map.unproject(coords);
    var pixCoords2 = map.latLngToLayerPoint(coords2);
    var pixCoords3 = map.latLngToContainerPoint(coords3);
    log(pixCoords); log(pixCoords2); log(pixCoords3);
  };

  var addGeoJsonMarkersBindEventInfo = function(geojson, userData) {
    checkinShitOut(geojson);
    userData.mapData = {};
    var mapData = userData.mapData;

  	cluster = new L.MarkerClusterGroup();
    var myIcon = L.divIcon({
      className: '',
           html: '<div class="marker"><i class="fa fa-music fa-1x" id="mus"></i></div>',         //<img src="/static/build/images/showMarker2.png"/>
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
  		pointToLayer: function (feature, latlng) {
  			return L.marker(latlng, markerStyle);
  		},
  		onEachFeature: function(feature, layer) {
  			layer.bindPopup(
  				'<h2>' + feature.properties.title + '</h2><br /><p>Performing at: <b>' + feature.properties.venueName + '</b><br />in <b>' + feature.properties.venueCity + ', ' + feature.properties.stateAbbr +  '</b>'
  			);
  			layer.on('popupclose', function() {
          _('#react-app')
                   .remove();
  				Construct.closeFooterAndKillPics();
  			});
  			layer.on('click', function(e) {
          log('e'); log(e);
  				var xhr = new XMLHttpRequest();
  				var fData = new FormData();
  				var url = '/api_flickr_query/';

  				fData.append('title', feature.properties.title);
  				fData.append('venue', feature.properties.venueName);
  				fData.append('city', feature.properties.cityName);

  				xhr.onloadend = function() {
  					var jsonArray = JSON.parse(this.responseText);
  					var artistPhotos = JSON.parse(jsonArray[0]);
  					var venuePhotos = JSON.parse(jsonArray[1]);
  							console.log(artistPhotos);
  							console.log(venuePhotos);
                log('uDataYo');
                console.log(userData);
  							Construct.displayPopupFooter(feature, artistPhotos, venuePhotos, userData);
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
  	        css('#block').height = '80px';

  	setTimeout( function() {
  		var center = map.getCenter();
  		var zoom   = map.getZoom();
      ThreeD.threeDMarkers();

          userData.mapData.currentCenter = center;
          userData.mapData.currentZoom   = zoom;
  	}, 800);

  	if (bool2) {
      _('#directions, #block')
            .css('display', 'block');
      _('#mapLogo')
              .css('opacity', '1');

      log(userData);
  		Construct.buildButtons(userData);
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

}) ();


//#DONE:60 Upload Photos
//#DONE:20 Sell iPhone
//#DONE:40 Order new iPhone


//DONE:0 Circle Music markers
//DOING:0 New Popups
//TODO:0 Fallback 2D view
//TODO:10 List View for Results (Markers, Center When Clicked)
//FIXME: Center Clusters at High Zoom level (Help Find)
//TODO:20 Well Defined Explore and Routing Interfaces
