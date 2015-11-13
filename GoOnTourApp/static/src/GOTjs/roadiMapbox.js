
import * as Event from 'eventfulData';
import moment from 'moment';
import {homeReload} from 'homeSlice';
import {getEventfulDataForMarkers} from 'eventfulData';
import {closeFooterAndKillPics, displayFlickrPhotos, buildButtons} from 'conStruction';


var map;
// var direct;
var directions;
var directionsArray = [];
// var uLocator;
// var full;
var markerArray = [];
var newDestination;
var group;
var markers;
var pathColorArray = ['#58292a', '#fdfca5', '#5c4c59', '#7bb64b', '#f5be57', '#091423', '#cd552d','#d9e7f1', '#2b86f3', '#0d6711', '#662e7f'];
var center;
var zoom;
// var fullControl;
var cluster;
var zoomBack;
var bool = true
var bool2 = true;
var bool3 = true;
var mapHashBool = true;
var useCoords;
var uCoords

L.mapbox.accessToken = 'pk.eyJ1IjoiZWphbWVzOSIsImEiOiIyNGNlYWUyYTU4M2Q4YTViYWM0YTBlMDRmNzIyMTYyNCJ9.RbU_-nlAAF6EOSVxj1kVMg';


function getUserLatLng(position) {
	var coords = [position.coords.longitude, position.coords.latitude];
	bool3 = false;
	initMap(coords);
};

function getUserCoordinates() {
		map = L.mapbox.map('map', 'mapbox.streets-satellite').setView([45.12, -86.69], 5);
		if (navigator.geolocation) {   // Needs Cross-Browser Support
				    navigator.geolocation.getCurrentPosition(getUserLatLng);
		}
};

		// map.on('dblclick', function(e) {
		// 	alert(e.latlng);
		// });
		// uLocator = L.control.locate({
		// 	  markerClass: L.marker,
		//     locateOptions: {
		// 		  maxZoom: 8
		// 	}
		// }).addTo(map);
		//
		// uLocator.start();
		// var focus = map.getCenter();
		// var userLocation = [focus.lat, focus.lng];
		// console.log(focus.lat, focus.lng);
		// map.setView(userLocation);


function initMap(coords) {
	if (mapHashBool === true) {
		window.location.hash = '#map';
		mapHashBool = false;
	}
	uCoords = [coords[1], coords[0]];
	console.log(uCoords);
	if (bool3) {
		map = L.mapbox.map('map', 'mapbox.streets-satellite').setView(uCoords, 7);
	} else {
		map.setView(uCoords, 7);
	}

	// directions = new L.mapbox.directions();
	// directionsArray.push(directions);
	// var directionsLayer = L.mapbox.directions.layer(directions)
	// 														.addTo(map);
	// var directionsInputControl = L.mapbox.directions.inputControl('inputs', directions).addTo(map);
	// var directionsErrorsControl = L.mapbox.directions.errorsControl('errors', directions).addTo(map);
  // var directionsRoutesControl = L.mapbox.directions.routesControl('routes', directions).addTo(map);
  // var directionsInstructionsControl = L.mapbox.directions.instructionsControl('instructions', directions).addTo(map);
	var marker = new L.Marker(uCoords, {
		draggable: true,
		    title: "I Fucking Did It manualDispatchChangeEvent!"
	})
	map.addLayer(marker);

	// uLocator = L.control.locate({
	// 	  markerClass: L.marker,
	//     locateOptions: {
	// 		  maxZoom: 8
	// 	}
	// }).addTo(map);
	// uLocator.start();
	//
	// setTimeout(function() {
	// 	var center1 = map.getCenter();
	// 	var userLocation = [center1.lat, center1.lng];
	// 	  console.log(center1.lat, center1.lng);
	// 	    map.setView(userLocation);
	// 	     directions
	// 			     .setOrigin(L.latLng(center1.lat, center1.lng))
	// 			     .setDestination(L.latLng(43.018217, -124.798284))
	// 	       //.addWaypoint(0, L.latLng(44.018217, -122.798284))
	// 			     .query();
	// }, 800);

	var calendar1 = new JsDatePick({
		 cellColorScheme: 'armygreen',
		 useMode: 2,
		 target: "start_date",
	});

	var calendar2 = new JsDatePick({
		 cellColorScheme: 'armygreen',
		 useMode: 2,
		 target: "end_date",
	});

	document.getElementById('submit').addEventListener('click', getEventfulDataForMarkers);

	document.getElementById('menu').addEventListener('click', buildMenus);

	window.onhashchange = function() {
			console.log('hashChange');
			if (window.location.hash == '') {
				console.log('reload');
				homeReload();
			} else if (window.location.hash == '#map') {
				console.log(forHash);
				if (forHash === 0) {
					loadMap(0);
				} else {
					console.log(userCoords);
					loadMap(userCoords);
				}
			}
	 };
	//  initCalendars();
};


function zoomBackOut() {
	map.setView(center, zoom);
};

function reRouteEngine() {

}

function routeEngine() {
	var dateArray = [startDate, endDate];
	console.log(dateArray);
	startDate = moment(startDate, 'MM-DD-YYYY');
	startDate = moment(startDate).add(1, 'days').format('MM-DD-YYYY');
	startDate = startDate.toString();
	console.log(dateArray[0], dateArray[1]);
	if (dateArray[0] != dateArray[1]) {
		var	newDirections = new L.mapbox.directions();
			  directionsArray.unshift(newDirections);
		var directionsRoutesControl = L.mapbox.directions.routesControl('routes', directionsArray[0])
																																													.addTo(map);
		var newdirectionsLayer = L.mapbox.directions.layer(directionsArray[0], {routeStyle: {color: pathColorArray[Math.floor(Math.random() * 11)], weight: 4, opacity: .75}})
																																																	.addTo(map);
		directionsArray[0]
				    .setOrigin(L.latLng(newDestination))
				    .setDestination(L.latLng(newDestination))
		      //.addWaypoint(0, L.latLng(44.018217, -122.798284))
				    .query();


		Event.getEventfulDataForMarkers();

		map.removeLayer(cluster);
		markerArray = [];
	} else {
		engineButton.id = 'killButton';
		engineButton2.id = 'killButton2';
		zoomBackButton = 'killButton3';
		document.getElementById('directions').style.width = '20px';
		map.removeLayer(cluster);
	}
};


function addGeoJsonMarkersBindEventInfo(geojson) {
	cluster = new L.MarkerClusterGroup();
	var markerStyle = {
		draggable: false,
			 icon: L.mapbox.marker.icon({
             'marker-size': '',
            'marker-color': '#444',
           'marker-symbol': 'music',
       })
	};
	markers = new L.geoJson(geojson, {
		pointToLayer: function (feature, latlng) {
			return L.marker(latlng, markerStyle);
		},
		onEachFeature: function(feature, layer) {
			layer.bindPopup(
				'<h2>' + feature.properties.title + '</h2><br /><p>Performing at: <b>' + feature.properties.venueName + '</b><br />in <b>' + feature.properties.cityName + '</b>'
			);
			layer.on('popupclose', function() {
				closeFooterAndKillPics();
			})
			layer.on('click', function(e) {
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
							displayFlickrPhotos(artistPhotos, venuePhotos);
				}
				xhr.open('post', url);
				xhr.send(fData);
			})
			layer.on('dblclick', function(e) {
				newDestination = (e.latlng);
				directionsArray[0]
									.setDestination(newDestination)
									.query()
			})
		}
	});
	cluster.addLayer(markers);
	map.addLayer(cluster);
	map.fitBounds(cluster.getBounds());
	document.getElementById('block').style.height = '80px';

	setTimeout( function() {
		center = map.getCenter();
		zoom = map.getZoom();
	}, 800);

	if (bool2) {
		buildButtons();
		bool2 = false;
	}

};


export {initMap, getUserCoordinates as mapUser, addGeoJsonMarkersBindEventInfo, as toMap}
