

// JavaScript Module for GoOnTour.org. Parses Eventful Data.
import { dom, log } from './alias';
import { goOnTourMapsModule as Map } from './goOnTourMaps';
import moment from 'moment';



export const eventfulDataModule = (function() {

  var object;
  var keywords;
  var startDate;
  var endDate;
  var eventsArray;
  var eArray;
  var userLocale;
  var searchParameters;


  var getEventfulDataForMarkers = function(userData) {
    var user = userData.searchParameters;
    var what = user.favArtist;
        user.genres.unshift(user.favArtist);
        keywords = user.genres.join(' || ');
        log(keywords);
        if (typeof startDate === 'undefined') {
          startDate = user.startDate;      log(startDate);
        } else {
          startDate = startDate;
        }
        if (typeof endDate === 'undefined') {
          endDate = user.endDate;       log(endDate);
        } else {
          endDate = endDate;
        }
        searchParameters = {
          app_key: "hQBcbKnVd94BDtCc",
             what: '',
         keywords: keywords,
         // where: '',
           within: 2000,
             when: getFormattedWhen(startDate, endDate),
        page_size: 200,
       sort_order: "popularity",
                };
                log(searchParameters);
    var formData = new FormData();
        formData.append('keywords', keywords);
        formData.append('when', getFormattedWhen(startDate, endDate));
                log(formData);
    var request = new XMLHttpRequest();
    var url     = "/api_eventful_query_results/";

    request.onloadend = function () {
      if (this.responseText === "Make API Call.") {
        alert('Calling Eventful API.');
        makeAPICallAndParseResults();
      } else {
       var data = JSON.parse(this.responseText); log(this.responseText, data);
                      parseResults(data);
      }
    };
    request.open('post', url);
    request.send(formData);
  };

  var makeAPICallAndParseResults = function () {
    EVDB.API.call("/events/search", searchParameters, function (data) {
      var objects = data.events.event;           log(data);
          object  = data;
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
                      e.push(objects[i].image);
           eventsArray.push(e);
          }
      addDistanceFromUserToEventsArray(eventsArray);
      var stringResult = JSON.stringify(data);
      var formData = new FormData();
      formData.append('result', stringResult);
      formData.append('keys', getKeywords(keywords));
      formData.append('when', startDate);

      var request = new XMLHttpRequest();
      var url = "/api_eventful_query_results/";

      request.onloadend = function () {
        alert(this.responseText);
      };
      request.open('post', url);
      request.send(formData);
    });
  };

  var parseResults = function(data) {
    var objects = data.events.event;            log(objects);
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
                      e.push(objects[i].image);
            eventsArray.push(e);
          }
      addDistanceFromUserToEventsArray(eventsArray);
  };

  var getFormattedWhen = function(startDate, endDate) {
    startDate = moment(startDate).format('YYYYMMDD00');
      endDate = moment(endDate).format('YYYYMMDD00');

    var formattedWhen = startDate + '-' + endDate; log('formwhen');log(formattedWhen);
    return formattedWhen;
  };

  var createGeoJson = function(eArray) {
    var geojson = [];
    for (var i = 0; i < eArray.length; i++)  {
      var object                             = {};
          object.type                        = "Feature";
          object.geometry                    = {};
          object.geometry['type']            = "Point";
          object.geometry['coordinates']     = [eArray[i][10], eArray[i][9]];
          object.properties                  = {};
          object.properties['title']         = eArray[i][0];
          object.properties['description']   = eArray[i][5];
          object.properties['cityName']      = eArray[i][1];
          object.properties['startTime']     = eArray[i][3];
          object.properties['venueName']     = eArray[i][2];
          object.properties['performers']    = eArray[i][4];
          object.properties['url']           = eArray[i][6];
          object.properties['venueAddress']  = eArray[i][7];
          object.properties['venueUrl']      = eArray[i][8];
          object.properties['venueImages']   = eArray[i][11];
          object.properties['marker-color']  = "#444";
          object.properties['marker-size']   = "medium";
          object.properties['marker-symbol'] = "music";
    geojson.push(object);
  }                                                             log(geojson);
    Map.toMap(geojson);

    return geojson;
  };

  // //Takes a string of keywords, separated by commas, and converts it into a format understood by the eventful API.
  // var getKeywords = function(keywords) {
  //           keywords = keywords.split(',');
  //           keywords = keywords.join(' ||');
  //                  log(keywords);
  //               return keywords;
  //}; getKeywords("jam bands, rock, country, apples")


  //Use Formula Function to determine each event distance from the user, and add it to the eventsArray.
  var addDistanceFromUserToEventsArray = function(eventsArray) {
    if (typeof newDestination === 'undefined') {  //#TODO:20 need a solution for this global.
      log(map);
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
      parseMarkersByDistance(eventsArray, 1000);
  };


  //Delete events from the eventsArray that are beyond the specified radius.
  var parseMarkersByDistance = function(eventsArray, radiusInMiles) {
    eArray = [];
    for (var i = 0; i < eventsArray.length; i++) {
      if (eventsArray[i][12] < radiusInMiles) {
          eArray.push(eventsArray[i]);
      }
    }
    log(eArray);
    // addMarkers(eArray, map);
    createGeoJson(eArray);
  };


  //This Function uses the Haversine Formula to determine distance between two sets of LatLng coordinates.
  var getDistanceFromLatLon = function(lat1,lon1,lat2,lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1);

    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon/2) * Math.sin(dLon/2)
                                              ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c; // Distance in km
    var result = d * 0.621; // Convert to mi
        return result;
  };

  //Converts degrees to radians for Haversine function.
  var deg2rad = function(deg) {
    return deg * (Math.PI/180);
  };

  return {
    getData: getEventfulDataForMarkers,
  };

}) ();
