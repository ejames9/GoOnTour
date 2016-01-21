

// JavaScript Module for GoOnTour.org. Parses Eventful Data for map markers.
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _alias = require('./alias');

var _goOnTourMaps = require('./goOnTourMaps');

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

//moment.js, JS library for manipulating time, date data.

var eventfulDataModule = (function () {

  var object;
  var keywords;
  var startDate;
  var endDate;
  var eventsArray;
  var eArray;
  var userLocale;
  var searchParameters;

  //This function is called by the _collectKeywords() function, in the showSearchOperations() space, in the conStructionModule. It
  //collects all necessary criteria for an eventful query, and calls the database to see if this search has been made before. userData is
  //passed in and used for some of the data.
  var getEventfulDataForMarkers = function getEventfulDataForMarkers(userData) {
    var user = userData.searchParameters;
    var what = user.favArtist;
    user.genres.unshift(user.favArtist); //Add favArtist to beginning of genres list.
    keywords = user.genres.join(' || '); //Format genres list into proper "or" format for search.
    (0, _alias.log)(keywords);
    if (typeof startDate === 'undefined') {
      //If startDate and endDate variables are not yet set, set them with userData.
      startDate = user.startDate;(0, _alias.log)(startDate); //If they are, reset them with the variable.
    } else {
        startDate = startDate;
      }
    if (typeof endDate === 'undefined') {
      endDate = user.endDate;(0, _alias.log)(endDate);
    } else {
      endDate = endDate;
    }

    var formattedWhen = getFormattedWhen(startDate, endDate); //Format dates for proper search format.

    searchParameters = {
      app_key: "hQBcbKnVd94BDtCc",
      what: '',
      keywords: keywords,
      // where: '',
      within: 2000,
      when: formattedWhen,
      page_size: 200,
      sort_order: "popularity"
    };
    (0, _alias.log)(searchParameters);
    var formData = new FormData();
    formData.append('keywords', keywords);
    formData.append('when', getFormattedWhen(startDate, endDate));
    (0, _alias.log)(formData);
    var request = new XMLHttpRequest();
    var url = "/api_eventful_query_results/";

    request.onloadend = function () {
      //Search database for search criteria. If not found, call makeAPICallAndParseResults()
      if (this.responseText === "Make API Call.") {
        //function. If found, skip ahead to parseResults() function.
        alert('Calling Eventful API.');
        makeAPICallAndParseResults(formattedWhen, keywords, userData);
      } else {
        var data = JSON.parse(this.responseText);(0, _alias.log)(this.responseText, data);
        parseResults(data, userData);
      }
    };
    request.open('post', url);
    request.send(formData);
  };

  //Using search parameters from previous function, call eventful API, and organize results into an array of arrays with pertinent data.
  var makeAPICallAndParseResults = function makeAPICallAndParseResults(when, keys, userData) {
    EVDB.API.call("/events/search", searchParameters, function (data) {
      var objects = data.events.event;
      object = data;
      eventsArray = [];
      for (var i = 0; i < objects.length; i++) {
        //Loop for creating individual event arrays.
        var events = [];
        var e = events;
        e.push(objects[i].title);
        e.push(objects[i].city_name);
        e.push(objects[i].venue_name);
        e.push(objects[i].start_time);
        e.push(objects[i].performers);
        e.push(objects[i].description);
        e.push(objects[i].url);
        e.push(objects[i].venue_address);
        e.push(objects[i].venue_url);
        e.push(objects[i].latitude);
        e.push(objects[i].longitude);
        e.push(objects[i].region_name);
        e.push(objects[i].region_abbr);
        e.push(objects[i].image);
        eventsArray.push(e); //Push event.
      }
      addDistanceFromUserToEventsArray(eventsArray, userData); //First, send array to  this function to get distance from user, then
      var stringResult = JSON.stringify(data); //stringify and store in database, incase search is made again.
      var formData = new FormData();
      formData.append('result', stringResult);
      formData.append('keys', keys);
      formData.append('when', when);

      var request = new XMLHttpRequest();
      var url = "/api_eventful_query_results/";

      request.onloadend = function () {
        alert(this.responseText);
      };
      request.open('post', url);
      request.send(formData);
    });
  };

  //If getEventfulDataForMarkers() function finds search criteria in the database, it calls this function with the results, and userData.
  //The function then arranges the data into an array of event arrays, and sends the result to addDistanceFromUserToEventsArray(),
  //just like the previous function.
  var parseResults = function parseResults(data, userData) {
    var objects = data.events.event;(0, _alias.log)(objects);
    eventsArray = [];
    for (var i = 0; i < objects.length; i++) {
      var events = [];
      var e = events;
      e.push(objects[i].title);
      e.push(objects[i].city_name);
      e.push(objects[i].venue_name);
      e.push(objects[i].start_time);
      e.push(objects[i].performers);
      e.push(objects[i].description);
      e.push(objects[i].url);
      e.push(objects[i].venue_address);
      e.push(objects[i].venue_url);
      e.push(objects[i].latitude);
      e.push(objects[i].longitude);
      e.push(objects[i].region_name);
      e.push(objects[i].region_abbr);
      e.push(objects[i].image);
      eventsArray.push(e);
    }
    addDistanceFromUserToEventsArray(eventsArray, userData);
  };

  //This function uses the moment.js library to arrange dates into a format the eventful API can use.
  var getFormattedWhen = function getFormattedWhen(startDate, endDate) {
    startDate = (0, _moment2['default'])(startDate).format('YYYYMMDD00');
    endDate = (0, _moment2['default'])(endDate).format('YYYYMMDD00');

    var formattedWhen = startDate + '-' + endDate;(0, _alias.log)('formwhen');(0, _alias.log)(formattedWhen); //Combine startDate and endDate into string.
    return formattedWhen;
  };

  //This function is called by the parseMarkersByDistance() function below, once all entries which are outside the specified radius are eliminated.
  //The function takes the event array, and creates an array of geojson objects that mapbox can use to render markers and bind data, and sends it to
  //addGeoJsonMarkersBindEventInfo() function in the goOnTourMapsModule..
  var createGeoJson = function createGeoJson(eArray, userData) {
    var geojson = [];
    for (var i = 0; i < eArray.length; i++) {
      //Loop for creating individual geojson objects.
      var object = {};
      object.type = "Feature";
      object.geometry = {};
      object.geometry['type'] = "Point";
      object.geometry['coordinates'] = [eArray[i][10], eArray[i][9]];
      object.properties = {};
      object.properties['title'] = eArray[i][0];
      object.properties['description'] = eArray[i][5];
      object.properties['venueCity'] = eArray[i][1];
      object.properties['startTime'] = eArray[i][3];
      object.properties['venueName'] = eArray[i][2];
      object.properties['performers'] = eArray[i][4];
      object.properties['url'] = eArray[i][6];
      object.properties['venueAddress'] = eArray[i][7];
      object.properties['venueUrl'] = eArray[i][8];
      object.properties['artistImages'] = eArray[i][13];
      object.properties['venueState'] = eArray[i][11];
      object.properties['stateAbbr'] = eArray[i][12];
      object.properties['marker-color'] = "#444";
      object.properties['marker-size'] = "medium";
      object.properties['marker-symbol'] = "music";
      geojson.push(object); //Push geojson object into array.
    }
    _goOnTourMaps.goOnTourMapsModule.toMap(geojson, userData); //Abbreviation for goOnTourMapsModule.addGeoJsonMarkersBindEventInfo(). Geojson is sent along with userData.

    return geojson;
  };

  // //Takes a string of keywords, separated by commas, and converts it into a format understood by the eventful API.
  // var getKeywords = function(keywords) {
  //           keywords = keywords.split(',');
  //           keywords = keywords.join(' ||');
  //                  log(keywords);
  //               return keywords;
  //}; getKeywords("jam bands, rock, country, apples")

  //Use Haversine Formula Function to determine each event distance from the user, and add it to the eventsArray.
  var addDistanceFromUserToEventsArray = function addDistanceFromUserToEventsArray(eventsArray, userData) {
    if (typeof newDestination === 'undefined') {
      //#TODO:20 need a solution for this global.
      (0, _alias.log)(map);
      for (var i = 0; i < eventsArray.length; i++) {
        var distance = getDistanceFromLatLon(map._initialCenter.lat, map._initialCenter.lng, eventsArray[i][9], eventsArray[i][10]);
        eventsArray[i].push(distance);
      }
    } else {
      for (var j = 0; j < eventsArray.length; j++) {
        var distance = getDistanceFromLatLon(newDestination.lat, newDestination.lng, eventsArray[j][9], eventsArray[j][10]);
        eventsArray[j].push(distance);
      }
    }
    parseMarkersByDistance(eventsArray, 1000, userData);
  };

  //Delete events from the eventsArray that are beyond the specified radius.
  var parseMarkersByDistance = function parseMarkersByDistance(eventsArray, radiusInMiles, userData) {
    eArray = [];
    for (var i = 0; i < eventsArray.length; i++) {
      if (eventsArray[i][14] < radiusInMiles) {
        eArray.push(eventsArray[i]);
      }
    }
    (0, _alias.log)(eArray);
    // addMarkers(eArray, map);
    createGeoJson(eArray, userData); //Once all entries outside of radius are eliminated, send result to createGeoJson() function, along with userData.
  };

  //This Function uses the Haversine Formula to determine distance between two sets of LatLng coordinates.
  var getDistanceFromLatLon = function getDistanceFromLatLon(lat1, lon1, lat2, lon2, userData) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1); // deg2rad below
    var dLon = deg2rad(lon2 - lon1);

    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    var result = d * 0.621; // Convert to mi
    return result;
  };

  //Converts degrees to radians for Haversine function.
  var deg2rad = function deg2rad(deg) {
    return deg * (Math.PI / 180);
  };

  return {
    getData: getEventfulDataForMarkers
  };
})();
exports.eventfulDataModule = eventfulDataModule;