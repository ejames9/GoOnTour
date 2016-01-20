
//conStruction.js JavaScript Module for GoOnTour.org. Deals mainly with building UI.
import { make, put, kill, css, on, off, log, dom, query} from './alias';
import { goOnTourMapsModule as Map } from './goOnTourMaps';
import { homeSliceModule as Home } from './homeSlice';
import { eventfulDataModule as Events } from './eventfulData';
import { PopupFooter } from './reactFlickrPopupFooter';



var without = require('lodash/array/without'),
      React = require('react/addons'),
   ReactDOM = require('react-dom'),
   xorCrypt = require('xor-crypt'),
 htmlToText = require('html-to-text'),
     moment = require('moment'),
          _ = require('jquery');
              require('jquery-ui');


export const conStructionModule = (function() {

  var artistPics;
  var venuePics;
  var elem;
  var refreshIntervalId;
  var toolTipsPane;
  var id;
  var delpane;
  var forHash;
  var userCoords;


  //This function creates buttons for the map navigation panel that slides in from the right side of the screen. It is pretty straigt-forward
  //DOM stuff. It creates the buttons, gives them id's, some icons, attaches them to the page and sets all necessary listeners.
  var buildButtons = function(userData) {
    var direct = dom('#directions');
    var engineButton = make('button');
        engineButton.id = 'engineButton';
    var engineButton2 = make('button');
        engineButton2.id = 'engineButton2';
    var zoomBackButton = make('button');
        zoomBackButton.id = 'zoomBackButton';
        engineButton.innerHTML = '<i class="fa fa-long-arrow-right fa-5x fa-inverse" id="nextDay"></i>';
        engineButton2.innerHTML = '<i class="fa fa-long-arrow-left fa-5x fa-inverse" id="prevDay"></i>';
        zoomBackButton.innerHTML = '<i class="fa fa-rocket fa-4x fa-inverse" id="rocket"></i>';
                  put(zoomBackButton, direct);
                    put(engineButton, direct);
                  put(engineButton2, direct);
        on('click', engineButton, function(userData) {
          Map.routeEngine(userData);
        });
        on('click', engineButton2, Map.reRouteEngine);
        on('click', zoomBackButton, function() {
          Map.zoomBackOut(userData);
        });
        on('mouseover', engineButton, toolTips);
        on('mouseover', engineButton2, toolTips);
        on('mouseover', zoomBackButton, toolTips);
  };


  //This function controls the width of the map nav panel. It opens and closes it.
  var buildMenus = function() {
    var menu = dom('#menu');
    var direct = dom('#directions');

    if (Map.bool) {  //#TODO:30 Need a solution for Map.bool. It currently works, but all global boolean flags will eventually need addressing.
      direct.style.width = '180px';
      log('mapBool');
      Map.bool = false;
      menu.innerHTML = ' ><br/>><br/>> ';
    } else {
      direct.style.width = '20px';
      Map.bool = true;
      menu.innerHTML = ' <<br/><<br/>< ';
    }
  };


  //This is a closure/grouping of nested functions, which control the popupFooter. It is called by a listener once a marker is clicked.
  var displayPopupFooter = function(feature, artistPhotos, venuePhotos, datum) {

    var dataArray = [];
    var data = feature.properties;                 log('props'); log(feature);
    var coords = feature.geometry.coordinates;

    var formatDate = moment(data.startTime).format('dddd, MMMM Do YYYY, [Doors open at] h:mm[pm]');   log('formatDate'); log(formatDate);
    var noMarkup   = htmlToText.fromString(data.description, null);                               log('noMarkup');   log(noMarkup);
        data.description = noMarkup;
        data.startTime   = formatDate;

    var artistPics = artistPhotos.photos.photo;
        dataArray.push(data);                           log(artistPics);

        _('<div id="react-app">')         //Create and attach the react app container to the DOM.
                    .appendTo('#block');

    //This function initializes the react app that displays information in the popupFooter.
    var _displayArtistShowInfo = function(dataArray) {
      var popupFooter = React.render(
        <PopupFooter data={dataArray} datum={datum} coords={coords}/>, //Attach react app to DOM.
        dom('#react-app')
      );
    };

    //This function opens the popupFooter "up".
    var _upFooter = function(data) {
      log('hello');
      var footer = css('#block');
      if (footer.height === '80px') {
        footer.height = '350px';
        footer.opacity = '.9';
      }
    };

    //This function displays photos from the flickr API at an interval set below.
    var _flickrPics = function(artistPics) {
      log(artistPics.length);
      if (artistPics.length > 0) {
        _upFooter(data);
        var i = Math.floor(Math.random() * 19);
        var footer = dom('#block');
            footer.innerHTML += '<img id="id" src="https://farm' + artistPics[String(i)].farm + '.staticflickr.com/' + artistPics[String(i)].server + '/' + artistPics[String(i)].id + '_' + artistPics[String(i)].secret + '_z.jpg"/>';

        refreshIntervalId = setInterval(function() {  //NOTE:10 This may not work.
          var artistPics = artistPhotos.photos.photo;
          var j = Math.floor(Math.random() * 19);
          var footer = dom('#block');
                      kill('#id');
              footer.innerHTML += '<img id="id" src="https://farm' + artistPics[String(j)].farm + '.staticflickr.com/' + artistPics[String(j)].server + '/' + artistPics[String(j)].id + '_' + artistPics[String(j)].secret + '_z.jpg"/>';
        }, 200000);
      }
    };

    if (artistPics.length > 0) { //When this function is called, the above functions load, then execute this logic: If artistPics array is not empty.....
      _upFooter()                   //Raise footer.
      _flickrPics(artistPics);      //Display photos.
      _displayArtistShowInfo(data)  //Display info from react app.
    }
  };

  //This function closes the footer, and clears the interval set by the _flickrPics() function.
  var closeFooterAndKillPics = function() {
    var footer = css('#block');
    if (footer.height === '350px') {
      kill('#id'); footer.height = '80px';
      clearInterval(refreshIntervalId);
    }
  };


  //This function creates tooltips that display info about the function of the buttons in the map nav panel. It's ridiculously complex and will
  //undoubtedly be rewritten when the time comes.
  function toolTips(e) {
    log('step1'); log(id);
    var source = e.target.id;    log('tt'); log(source);
        toolTipsPane = make('div');
    if (source === 'engineButton') {
      if (typeof id !== 'undefined') {
        log('undy'); log(id);
        var delPane = dom(id);
        log(delPane);
        if (delPane !== null) {
          log('kill1');
          kill(id);
        }
      }
    toolTipsPane.innerHTML = 'Set Current Leg and Proceed to Next Day of Trip';
    toolTipsPane.id = 'ttPaneEngine';
    id = '#ttPaneEngine';

    } else if (source === 'engineButton2') {
      if (typeof id !== 'undefined') {
        var delPane = dom(id);
        log('id'); log(id);
        if (delPane !== null) {
          log('kill2');
          kill(id);
        }
      }
    toolTipsPane.innerHTML = 'Erase Current Leg and Edit Previous Leg';
    toolTipsPane.id = 'ttPaneEngine2';
    id = '#ttPaneEngine2';

    } else {
      if (typeof id !== 'undefined') {
        var delPane = dom(id);
        if (delPane !== null) {
          log('kill3');
            kill(id);
        }
      }
    log('hello yall!');
    toolTipsPane.innerHTML = 'Zoom Back Out';
    toolTipsPane.id = 'ttPaneZoom';
    id = '#ttPaneZoom';
    }
    put(toolTipsPane, dom('#map'));
    log('ttpane');
    log(toolTipsPane);

    if (toolTipsPane !== null) {
      setTimeout(function() {
        log('kill4');
         log(toolTipsPane);
        dom('#map').removeChild(toolTipsPane);
      }, 3000); //NOTE:20 May have problems with this function.
    }
  };


  //This function is called either by the reactGeoCoder (with coordinates), if the user manually selects a starting point, or by the findShows() Function
  //in the homeSliceModule (with the number 0 as the coordinates arg), if the user decides to use the HTML5 geolocation API. An HTML template is provided
  //by a Django view/API which is called via XMLHttpRequest, and loaded into a 'main' element. The map container is then displayed, and the map initialization Function
  //is called either with coordinates or without (nulled).
  var loadMap = function(coordinates, userData) {
    forHash = coordinates;        log(coordinates);

    var xhr = new XMLHttpRequest();     //Call Map view/API
    var url = '/map/';

    xhr.onloadend = function() {
      var newHTML = this.responseText;

      var lines    = dom('#lines');     log(lines);
      var bundle   = dom('#bundle');
      var main     = dom('main');
      var trashCan = dom('#trashCan');

          if (lines !== null) {
            kill(lines);
          }
          kill('#trashCan');            //Remove Home page HTML
          main.innerHTML = newHTML;     //Set new map page HTML

          _('#calContainer')            //Set up DatePicker view
               .css('display', 'block');
          _('#gel')
               .after(_('#calContainer'));
          _('#gel')
               .css('display', 'block');
          _('#directions, #block, #keywords, #submit')
                .css('display', 'none');
          _('#mapLogo')
                  .css('opacity', '.7');

      if (coordinates !== 0) {          //If coordinates are not 0, display map container, and initialize map with coordinates. Pass in userData.
        log('!0'); log(userData);
        _('#map')
              .css('display', 'block');
        Map.initMap(coordinates, userData);
      } else {                          //If coordinates argument is 0, display map container, and initialize map with null as first arg. Pass in userData.
        log('0');
        _('#map')
              .css('display', 'block');
        Map.initMap(null, userData);

      }
    };
    xhr.open('GET', url);
    xhr.send(null);


  };

  //This function is not yet being used, but may be in the future. It's purpose is to reload the Home page without reloading the browser window.
  //It calls a Django view as an API, and loads the HTML into a 'main' element. It then calls the Home page initialization function from the homeSliceModule.
  var homeReload = function() {
    var xhr = new XMLHttpRequest(),
        url = '';

    var formData = new FormData();
        formData.append('reload', 'homeMain.html');

    xhr.onloadend = function() {
      var newHTML = this.responseText;

            log(newHTML);

      var body      = dom('body'),
          homeSlice = dom('#homeSlice'),
          main      = dom('main'),
          lines     = dom('#lines');

      kill('#trashCan');
      main.innerHTML = newHTML;

      var bundle      =  make('script');
          bundle.type = 'text/JavaScript';
          bundle.src  = '/static/roadi/bundle.js';
          bundle.id   = 'bundle';

      body.insertBefore(bundle, homeSlice);
      Home.initHome();                     //Initialize Home page.
    };
    xhr.open('POST', url);
    xhr.send(formData);
  };


  //This group of functions controls the UI for setting search parameters. Using a closure here to group search operation functions together,
  //and also utilizing the resulting namespace for userData, so as to avoid using a global variable.
  var showSearchOperations = function(data) {

    // var decryptedData = xorCrypt(data);
    var userData = {};       //JSON.parse(decryptedData); log('userData');log(userData);
        userData.searchParameters = {'startDate': null, 'endDate': null};
        userData.searchParameters.genres = [];
    var genre,
        displayGenres = [],
               genres = userData.searchParameters.genres;


    //This function simply removes the dark filter over the map  once the user enters all search parameters, and calls the
    //getEventfulDataForMarkers() function from the eventfulDataModule, with the completed userData object. The commented-out code is
    //from when I was trying to make the map 3D using CSS only. It will be deleted when I am sure it is no longer useful.
    var _collectKeywords = function() {
      _('#gel')
              .remove();
      // _('#map')
      //         .addClass('map');
      // _('#trashCan')
      //         .addClass('trashCan');
      // _('body')
      //         .addClass('stars');
      _('#mapLogo')
              .css('display', 'block');

      log(userData); log('ylkjlkj');
      // var getPxBounds = map.getPixelBounds;   //Animation loop for Mapbox tiles.
      //
      // map.getPixelBounds = function () {
      //   var bounds = getPxBounds.call(this);
      //   var val = 1000;
      //   bounds.min.x=bounds.min.x-val;
      //   bounds.min.y=bounds.min.y-val;
      //   bounds.max.x=bounds.max.x+val;
      //   bounds.max.y=bounds.max.y+val;
      //   return bounds;
      // };
      Events.getData(userData); //Abbreviation for eventfulDataModule.getEventfulDataForMarkers().
    };

    //This function takes the value of the favArtist input, creates the HTML for the genre checkboxes, and appends it to the DOM.
    var _collectFavArtistGetGenres = function() {
      var favArtist = _('.favArtist-input').val();

      userData.searchParameters.favArtist = favArtist;  log(userData.searchParameters.favArtist);

      _('<div class="checkbox-container">'  +
            '<input id="checkbox1" class="checkbox" type="checkbox" name="checkbox1" value="Jam Bands">' +
            '<label for="checkbox1" data-value="l"></label>'  +
            '<input id="checkbox2" class="checkbox" type="checkbox" name="checkbox2" value="Jazz">'  +
            '<label for="checkbox2" value=""></label>'  +
            '<input id="checkbox3" class="checkbox" type="checkbox" name="checkbox3" value="Funk">' +
            '<label for="checkbox3" value=""></label>'  +
            '<input id="checkbox4" class="checkbox" type="checkbox" name="checkbox4" value="Rock">'  +
            '<label for="checkbox4" value=""></label>'  +
            '<input id="checkbox5" class="checkbox" type="checkbox" name="checkbox5" value="Blues">' +
            '<label for="checkbox5" value=""></label>'  +
            '<input id="checkbox6" class="checkbox" type="checkbox" name="checkbox6" value="Bluegrass">'  +
            '<label for="checkbox6" value=""></label>'  +
         '</div>')
              .appendTo(_('#gel'));

      _('<div class="label-container">'  +
            '<span class="labels">Jam Bands</span>'  +
            '<span class="labels">Jazz</span>'  +
            '<span class="labels">Funk</span>'  +
            '<span class="labels">Rock</span>'  +
            '<span class="labels">Blues</span>'  +
            '<span class="labels">Bluegrass</span>'  +
        '</div>')
              .prependTo('#gel');

      _('.favArtist-input')
              .val('')
              .prop('readonly', true)
              .addClass('favArtist-input-fx');
      _('#gelText')
              .html('What are your favorite genres?')
              .css('left', '29%');

      _('.date-range-submit')
              .html('find shows!')
              .css('top', '68.5%')
              .off('click', _collectFavArtistGetGenres)
              .on('click', _collectKeywords);

      _('.checkbox')
              .get()
              .forEach(function(el) {                   //This function takes the value of a clicked checkbox input, checkes an array to see if it is already there, adds it if it isn't,
                on('click', el, function(el) {          //or removes it if it is and then displays the resulting array in the input.
                  var value = el.target.value;   log(value); log(genres);
                  if (genres.indexOf(value) === -1) {
                    displayGenres.push(' ' + value);
                           genres.push(value);
                    _('.favArtist-input').val(displayGenres);
                  } else {
                    genre = ' ' + value;
                    displayGenres = without(displayGenres, genre);
                           genres = without(genres, value);
                    _('.favArtist-input').val(displayGenres);
                  }
                });
              });
    };

    //This function removes the reactDateRangePicker and sets up the favArtist collection UI.
    var _killCalendarsBuildFavArtistInput = function() {
      _('#calContainer').remove();
      _('#gelText')
              .html('Who is your favorite Artist/band?')
              .css({fontSize: '36px', left: '28%'});
      _("<input type='text'>")
              .addClass('favArtist-input')
              .appendTo(_('#gel'));
      _('.date-range-submit')
              .off('click', _submitFunction)
              .on('click', _collectFavArtistGetGenres)
              .css({top: '55%'});
    };

    //This is the callback function for the submit button listener.
    var _submitFunction = function() {
      var start = userData.searchParameters.startDate,
            end = userData.searchParameters.endDate;

      if (start || end === null) {
        userData.searchParameters.startDate = _('.drpInputS').val();
        userData.searchParameters.endDate   = _('.drpInputE').val();

        var startDate = userData.searchParameters.startDate,
              endDate = userData.searchParameters.endDate;
        // alert('from ' + startDate + ' to ' + endDate);

        _killCalendarsBuildFavArtistInput();
      } else {
        userData.searchParameters.favArtist = _('#favArtist').val();
        userData.searchParameters.keywords  = _('#keywords').val();

        var favArtist = userData.searchParameters.favArtist,
             keywords = userData.searchParameters.keywords;

        alert(favArtist, keywords);
      }
    };

    var elems = _('.date-range-submit');       log(elems);

    if (elems.length === 0) {
      _('<button>')                                 //create/append submit button,
              .addClass('date-range-submit')        //set up event listener for callback Function
               .appendTo(_('#gel'))                  //define callback
                .html('Submit')
                 .on('click', _submitFunction);
    }
  };


    //Public functions for this module.
                return {
                 forHash: forHash,
            buildButtons: buildButtons,
              buildMenus: buildMenus,
      displayPopupFooter: displayPopupFooter,
  closeFooterAndKillPics: closeFooterAndKillPics,
                 loadMap: loadMap,
              homeReload: homeReload,
    showSearchOperations: showSearchOperations
                       };

}) ();
