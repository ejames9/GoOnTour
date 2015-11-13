// JavaScript Code for the roadi Application.


//Global variables.
var map;
var marker;
var markers;
var drawingManager;
var portland = {lat: 45.5236111, lng: -122.675};
var directionsDisplay;
var directionsService;
var initialLocation;
var browserSupportFlag = new Boolean();

//Map initialization functions. Sets a Marker on Geolocated user position if possible, Otherwise, map will be
//positioned on Portland or New York with no marker. Addition of Listeners.
function initMap() {
  directionsService = new google.maps.DirectionsService();
  directionsDisplay = new google.maps.DirectionsRenderer();

  map = new google.maps.Map(document.getElementById('map'), {
    center: initialLocation,
    zoom: 5,
    mapTypeId: google.maps.MapTypeId.HYBRID
  })

  if(navigator.geolocation) {  // Try W3C Geolocation (Preferred)
    browserSupportFlag = true;
    navigator.geolocation.getCurrentPosition(function(position) {
      initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
      map.setCenter(initialLocation);
      marker = new google.maps.Marker({
        position: initialLocation,
        animation: google.maps.Animation.DROP,
        map:map,
        title: "Hello Y'all!"
      })
      marker.addListener('click', toggleBounce);
    }, function() {
      handleNoGeolocation(browserSupportFlag)
    });
  } else {
    browserSupportFlag = false;  // Browser doesn't support Geolocation
    handleNoGeolocation(browserSupportFlag);
  }

  // google.maps.event.addListener(map, 'click', function(event) {
  //   addMarkers(event.latLng, map);
  // });

  document.getElementById('submit').addEventListener('click', getEventfulDataForMarkers);

  // directionsDisplay.setMap(map);

  var geoControl = L.mapbox.geocoderControl('mapbox.places');
  var cont = document.getElementById('cont');
  geoControl.addTo(map);
};


//Function runs if browser doesn't support Geolocation.
function handleNoGeolocation(errorFlag) {
    if (errorFlag == true) {
      alert("Geolocation service failed.");
      initialLocation = newyork;
    } else {
      alert("Your browser doesn't support geolocation. We've placed you in Portland.");
      initialLocation = portland;
    }
    map.setCenter(initialLocation);
};

//Draws a polyline between 'start' and 'end' points on the map.
function getRoute(start, end, wayPoints) {
  var request = {
    origin: start,
    destination: end,
    waypoints: wayPoints,
    travelMode: google.maps.TravelMode.DRIVING
  };
  directionsService.route(request, function(result, status){
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(result);
    }
  })
};

// Alternates between bouncing animation, and no animation.
function toggleBounce() {
  console.log(markers);
  if (markers.getAnimation() !== null) {
    markers.setAnimation(null);
  } else {
    markers.setAnimation(google.maps.Animation.BOUNCE);
  }
};

//Adds Markers, labelled as incremented through the Alphabet.
function addMarkers(location, map) {
  console.log(initialLocation);
  console.log(location);
  var bounds = new google.maps.LatLngBounds();
  for (var i = 0; i < location.length; i++) {
    var myLatLng = new google.maps.LatLng(location[i][9], location[i][10]);
    markers = new google.maps.Marker({
      position: myLatLng,
      title: location[i][0],
      label: location[i][0],
      map: map,
      draggable: false
    })
    bounds.extend(myLatLng);
  }
  map.fitBounds(bounds);
};
