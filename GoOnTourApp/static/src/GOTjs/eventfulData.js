// JavaScript for parsing eventful Data, for the roadi Application.
import {toMap} from 'roadiMapbox';
import moment from 'moment';

var object;
var keywords;
var startDate;
var endDate;
var when;
var eventsArray;
var eArray;
var userLocale;
var geoJson;

function getEventfulDataForMarkers() {
  var what = document.getElementById('favArtist').value;
      keywords = document.getElementById('keywords').value;
      if (typeof startDate === 'undefined') {
        startDate = document.getElementById('start_date').value;
        console.log(startDate);
      } else {
        startDate = startDate;
      }
      if (typeof endDate === 'undefined') {
        endDate = document.getElementById('end_date').value;
        console.log(endDate);
      } else {
        endDate = endDate;
      }
      searchParameters = {
        app_key: "hQBcbKnVd94BDtCc",
           what: what,
       keywords: getKeywords(keywords),
          // where: '',
         within: 2000,
           when: newGetWhen(startDate),
      page_size: 200,
     sort_order: "popularity",
              };
  var formData = new FormData();
  formData.append('keywords', getKeywords(keywords)) ;
  formData.append('when', startDate);

  var request = new XMLHttpRequest();
  url = "/api_eventful_query_results/";

  request.onloadend = function () {
    if (this.responseText === "Make API Call.") {
      alert('Calling Eventful API.')
      makeAPICallAndParseResults()
    } else {
     console.log(this.responseText);
     data = JSON.parse(this.responseText);
     console.log(data);
     parseResults(data);
    }
  }

  request.open('post', url);
  request.send(formData);
};


function makeAPICallAndParseResults() {
  EVDB.API.call("/events/search", searchParameters, function (oData) {
    var objects = oData.events.event;
        object  = oData;
        console.log(objects);
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
    stringResult = JSON.stringify(oData);
    var formData = new FormData;
    formData.append('result', stringResult);
    formData.append('keys', getKeywords(keywords));
    formData.append('when', startDate);

    request = new XMLHttpRequest;
    url = "/api_eventful_query_results/";

    request.onloadend = function () {
      alert(this.responseText);
    }
    request.open('post', url);
    request.send(formData);
  })
};


function parseResults(data) {
  var objects = data.events.event;
      console.log(objects);
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


function newGetWhen(startDate) {
  var formatWhen = startDate;
      formatWhen = moment(formatWhen, 'MM-DD-YYYY').format('YYYYMMDD00');
       console.log(formatWhen);
         newWhen = formatWhen + '-' + formatWhen;
            return newWhen;
};


function createGeoJson(eArray) {
  geojson = [];
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
  }
  console.log(geojson);
  toMap(geojson);

  return geojson;
};

//Takes a string of keywords, separated by commas, and converts it into a format understood by the eventful API.
function getKeywords(keywords) {
   keywords = keywords.split(',');
   keywords = keywords.join(' ||');
  console.log(keywords);
       return keywords;
}; // getKeywords("jam bands, rock, country, apples")


//Use Formula Function to determine each event distance from the user, and add it to the eventsArray.
function addDistanceFromUserToEventsArray(eventsArray) {
  if (typeof newDestination === 'undefined') {
    userLocale = map.getCenter();
    for (var i = 0; i < eventsArray.length; i++) {
      distance = getDistanceFromLatLon(userLocale.lat, userLocale.lng, eventsArray[i][9], eventsArray[i][10]);
      eventsArray[i].push(distance);
    }
  } else {
      for (var i = 0; i < eventsArray.length; i++) {
        distance = getDistanceFromLatLon(newDestination.lat, newDestination.lng, eventsArray[i][9], eventsArray[i][10]);
                   eventsArray[i].push(distance);
    }
  }
    parseMarkersByDistance(eventsArray, 1000);
};


//Delete events from the eventsArray that are beyond the specified radius.
function parseMarkersByDistance(eventsArray, radiusInMiles) {
  eArray = [];
  for (var i = 0; i < eventsArray.length; i++) {
    if (eventsArray[i][12] < radiusInMiles) {
        eArray.push(eventsArray[i]);
    }
  }
   console.log(eArray);
  // addMarkers(eArray, map);
  createGeoJson(eArray);
};


//This Function uses the Haversine Formula to determine distance between two sets of LatLng coordinates.
function getDistanceFromLatLon(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1);

  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
          Math.sin(dLon/2) * Math.sin(dLon/2)
                                            ;
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c; // Distance in km
      result = d * .621; // Convert to mi
      return result;
};

//Converts degrees to radians for Haversine function.
function deg2rad(deg) {
  return deg * (Math.PI/180)
};

export {getEventfulDataForMarkers}
