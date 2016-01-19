
//conStruction.js JavaScript Module for GoOnTour.org. Deals mainly with building UI.
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _alias = require('./alias');

var _goOnTourMaps = require('./goOnTourMaps');

var _homeSlice = require('./homeSlice');

var _eventfulData = require('./eventfulData');

var _reactFlickrPopupFooter = require('./reactFlickrPopupFooter');

var without = require('lodash/array/without'),
    React = require('react/addons'),
    ReactDOM = require('react-dom'),
    xorCrypt = require('xor-crypt'),
    htmlToText = require('html-to-text'),
    moment = require('moment'),
    _ = require('jquery');
require('jquery-ui');

var conStructionModule = (function () {

  var artistPics;
  var venuePics;
  var elem;
  var refreshIntervalId;
  var toolTipsPane;
  var id;
  var delpane;
  var forHash;
  var userCoords;

  var buildButtons = function buildButtons(userData) {
    var direct = (0, _alias.dom)('#directions');
    var engineButton = (0, _alias.make)('button');
    engineButton.id = 'engineButton';
    var engineButton2 = (0, _alias.make)('button');
    engineButton2.id = 'engineButton2';
    var zoomBackButton = (0, _alias.make)('button');
    zoomBackButton.id = 'zoomBackButton';
    engineButton.innerHTML = '<i class="fa fa-long-arrow-right fa-5x fa-inverse" id="nextDay"></i>';
    engineButton2.innerHTML = '<i class="fa fa-long-arrow-left fa-5x fa-inverse" id="prevDay"></i>';
    zoomBackButton.innerHTML = '<i class="fa fa-rocket fa-4x fa-inverse" id="rocket"></i>';
    (0, _alias.put)(zoomBackButton, direct);
    (0, _alias.put)(engineButton, direct);
    (0, _alias.put)(engineButton2, direct);
    (0, _alias.on)('click', engineButton, function (userData) {
      _goOnTourMaps.goOnTourMapsModule.routeEngine(userData);
    });
    (0, _alias.on)('click', engineButton2, _goOnTourMaps.goOnTourMapsModule.reRouteEngine);
    (0, _alias.on)('click', zoomBackButton, function () {
      _goOnTourMaps.goOnTourMapsModule.zoomBackOut(userData);
    });
    (0, _alias.on)('mouseover', engineButton, toolTips);
    (0, _alias.on)('mouseover', engineButton2, toolTips);
    (0, _alias.on)('mouseover', zoomBackButton, toolTips);
  };

  var buildMenus = function buildMenus() {
    (0, _alias.log)(_goOnTourMaps.goOnTourMapsModule.bool);
    var menu = (0, _alias.dom)('#menu');
    var direct = (0, _alias.dom)('#directions');

    if (_goOnTourMaps.goOnTourMapsModule.bool) {
      //#DONE:30 Need a solution for Map.bool
      direct.style.width = '180px';
      (0, _alias.log)('mapBool');
      _goOnTourMaps.goOnTourMapsModule.bool = false;
      menu.innerHTML = ' ><br/>><br/>> ';
    } else {
      direct.style.width = '20px';
      _goOnTourMaps.goOnTourMapsModule.bool = true;
      menu.innerHTML = ' <<br/><<br/>< ';
    }
  };

  var displayPopupFooter = function displayPopupFooter(feature, artistPhotos, venuePhotos, datum) {

    var dataArray = [];
    var data = feature.properties;(0, _alias.log)('props');(0, _alias.log)(feature);
    var coords = feature.geometry.coordinates;

    var formatDate = moment(data.startTime).format('dddd, MMMM Do YYYY, [Doors open at] h:mm[pm]');(0, _alias.log)('formatDate');(0, _alias.log)(formatDate);
    var noMarkup = htmlToText.fromString(data.description, null);(0, _alias.log)('noMarkup');(0, _alias.log)(noMarkup);
    data.description = noMarkup;
    data.startTime = formatDate;

    var artistPics = artistPhotos.photos.photo;
    dataArray.push(data);(0, _alias.log)(artistPics);

    _('<div id="react-app">').appendTo('#block');

    var _displayArtistShowInfo = function _displayArtistShowInfo(dataArray) {
      var popupFooter = React.render(React.createElement(_reactFlickrPopupFooter.PopupFooter, { data: dataArray, datum: datum, coords: coords }), (0, _alias.dom)('#react-app'));
    };

    var _upFooter = function _upFooter(data) {
      (0, _alias.log)('hello');
      var footer = (0, _alias.css)('#block');
      if (footer.height === '80px') {
        footer.height = '350px';
        footer.opacity = '.9';
      }
    };

    var _flickrPics = function _flickrPics(artistPics) {
      (0, _alias.log)(artistPics.length);
      if (artistPics.length > 0) {
        _upFooter(data);
        var i = Math.floor(Math.random() * 19);
        var footer = (0, _alias.dom)('#block');
        footer.innerHTML += '<img id="id" src="https://farm' + artistPics[String(i)].farm + '.staticflickr.com/' + artistPics[String(i)].server + '/' + artistPics[String(i)].id + '_' + artistPics[String(i)].secret + '_z.jpg"/>';

        refreshIntervalId = setInterval(function () {
          //NOTE:10 This may not work.
          var artistPics = artistPhotos.photos.photo;
          var j = Math.floor(Math.random() * 19);
          var footer = (0, _alias.dom)('#block');
          (0, _alias.kill)('#id');
          footer.innerHTML += '<img id="id" src="https://farm' + artistPics[String(j)].farm + '.staticflickr.com/' + artistPics[String(j)].server + '/' + artistPics[String(j)].id + '_' + artistPics[String(j)].secret + '_z.jpg"/>';
        }, 200000);
      }
    };

    if (artistPics.length > 0) {
      _upFooter();
      _flickrPics(artistPics);
      _displayArtistShowInfo(data);
    }
  };

  var closeFooterAndKillPics = function closeFooterAndKillPics() {
    var footer = (0, _alias.css)('#block');
    if (footer.height === '350px') {
      (0, _alias.kill)('#id');footer.height = '80px';
      clearInterval(refreshIntervalId);
    }
  };

  function toolTips(e) {
    (0, _alias.log)('step1');(0, _alias.log)(id);
    var source = e.target.id;(0, _alias.log)('tt');(0, _alias.log)(source);
    toolTipsPane = (0, _alias.make)('div');
    if (source === 'engineButton') {
      if (typeof id !== 'undefined') {
        (0, _alias.log)('undy');(0, _alias.log)(id);
        var delPane = (0, _alias.dom)(id);
        (0, _alias.log)(delPane);
        if (delPane !== null) {
          (0, _alias.log)('kill1');
          (0, _alias.kill)(id);
        }
      }
      toolTipsPane.innerHTML = 'Set Current Leg and Proceed to Next Day of Trip';
      toolTipsPane.id = 'ttPaneEngine';
      id = '#ttPaneEngine';
    } else if (source === 'engineButton2') {
      if (typeof id !== 'undefined') {
        var delPane = (0, _alias.dom)(id);
        (0, _alias.log)('id');(0, _alias.log)(id);
        if (delPane !== null) {
          (0, _alias.log)('kill2');
          (0, _alias.kill)(id);
        }
      }
      toolTipsPane.innerHTML = 'Erase Current Leg and Edit Previous Leg';
      toolTipsPane.id = 'ttPaneEngine2';
      id = '#ttPaneEngine2';
    } else {
      if (typeof id !== 'undefined') {
        var delPane = (0, _alias.dom)(id);
        if (delPane !== null) {
          (0, _alias.log)('kill3');
          (0, _alias.kill)(id);
        }
      }
      (0, _alias.log)('hello yall!');
      toolTipsPane.innerHTML = 'Zoom Back Out';
      toolTipsPane.id = 'ttPaneZoom';
      id = '#ttPaneZoom';
    }
    (0, _alias.put)(toolTipsPane, (0, _alias.dom)('#map'));
    (0, _alias.log)('ttpane');
    (0, _alias.log)(toolTipsPane);

    if (toolTipsPane !== null) {
      setTimeout(function () {
        (0, _alias.log)('kill4');
        (0, _alias.log)(toolTipsPane);
        (0, _alias.dom)('#map').removeChild(toolTipsPane);
      }, 3000); //NOTE:20 May have problems with this function.
    }
  };

  var loadMap = function loadMap(coordinates, userData) {
    forHash = coordinates;(0, _alias.log)(coordinates);

    var xhr = new XMLHttpRequest();
    var url = '/map/';

    xhr.onloadend = function () {
      var newHTML = this.responseText;

      var lines = (0, _alias.dom)('#lines');(0, _alias.log)(lines);
      var bundle = (0, _alias.dom)('#bundle');
      var main = (0, _alias.dom)('main');
      var trashCan = (0, _alias.dom)('#trashCan');

      if (lines !== null) {
        (0, _alias.kill)(lines);
      }
      (0, _alias.kill)('#trashCan');
      main.innerHTML = newHTML;

      _('#calContainer').css('display', 'block');
      _('#gel').after(_('#calContainer'));
      _('#gel').css('display', 'block');
      _('#directions, #block, #keywords, #submit').css('display', 'none');
      _('#mapLogo').css('opacity', '.7');

      if (coordinates !== 0) {
        //NOTE:0 Removed this assignment => userCoords = coordinates;
        (0, _alias.log)('!0');(0, _alias.log)(userData);
        _('#map').css('display', 'block');
        _goOnTourMaps.goOnTourMapsModule.initMap(coordinates, userData);
      } else {
        (0, _alias.log)('0');
        _('#map').css('display', 'block');
        _goOnTourMaps.goOnTourMapsModule.initMap(null, userData);
      }
    };
    xhr.open('GET', url);
    xhr.send(null);
  };

  var homeReload = function homeReload() {
    var xhr = new XMLHttpRequest(),
        url = '';

    var formData = new FormData();
    formData.append('reload', 'homeMain.html');

    xhr.onloadend = function () {
      var newHTML = this.responseText;

      (0, _alias.log)(newHTML);

      var body = (0, _alias.dom)('body'),
          homeSlice = (0, _alias.dom)('#homeSlice'),
          main = (0, _alias.dom)('main'),
          lines = (0, _alias.dom)('#lines');

      (0, _alias.kill)('#trashCan');
      main.innerHTML = newHTML;

      var bundle = (0, _alias.make)('script');
      bundle.type = 'text/JavaScript';
      bundle.src = '/static/roadi/bundle.js';
      bundle.id = 'bundle';

      body.insertBefore(bundle, homeSlice);
      initHome();
    };
    xhr.open('POST', url);
    xhr.send(formData);
  };

  var showSearchOperations = function showSearchOperations(data) {
    // Using a closure here to group search operation functions together,
    //  and also utilizing the resulting namespace for userData, so as
    // var decryptedData = xorCrypt(data);         // to avoid using a global variable.

    var userData = {}; //JSON.parse(decryptedData); log('userData');log(userData);
    userData.searchParameters = { 'startDate': null, 'endDate': null };
    userData.searchParameters.genres = [];
    var genre,
        displayGenres = [],
        genres = userData.searchParameters.genres;

    var _collectKeywords = function _collectKeywords() {
      _('#gel').remove();
      // _('#map')
      //         .addClass('map');
      // _('#trashCan')
      //         .addClass('trashCan');
      // _('body')
      //         .addClass('stars');
      _('#mapLogo').css('display', 'block');

      (0, _alias.log)(userData);(0, _alias.log)('ylkjlkj');
      // var getPxBounds = map.getPixelBounds;
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
      _eventfulData.eventfulDataModule.getData(userData);
    };

    var _collectFavArtistGetGenres = function _collectFavArtistGetGenres() {
      var favArtist = _('.favArtist-input').val();

      userData.searchParameters.favArtist = favArtist;(0, _alias.log)(userData.searchParameters.favArtist);

      _('<div class="checkbox-container">' + '<input id="checkbox1" class="checkbox" type="checkbox" name="checkbox1" value="Jam Bands">' + '<label for="checkbox1" data-value="l"></label>' + '<input id="checkbox2" class="checkbox" type="checkbox" name="checkbox2" value="Jazz">' + '<label for="checkbox2" value=""></label>' + '<input id="checkbox3" class="checkbox" type="checkbox" name="checkbox3" value="Funk">' + '<label for="checkbox3" value=""></label>' + '<input id="checkbox4" class="checkbox" type="checkbox" name="checkbox4" value="Rock">' + '<label for="checkbox4" value=""></label>' + '<input id="checkbox5" class="checkbox" type="checkbox" name="checkbox5" value="Blues">' + '<label for="checkbox5" value=""></label>' + '<input id="checkbox6" class="checkbox" type="checkbox" name="checkbox6" value="Bluegrass">' + '<label for="checkbox6" value=""></label>' + '</div>').appendTo(_('#gel'));

      _('<div class="label-container">' + '<span class="labels">Jam Bands</span>' + '<span class="labels">Jazz</span>' + '<span class="labels">Funk</span>' + '<span class="labels">Rock</span>' + '<span class="labels">Blues</span>' + '<span class="labels">Bluegrass</span>' + '</div>').prependTo('#gel');

      _('.favArtist-input').val('').prop('readonly', true).addClass('favArtist-input-fx');
      _('#gelText').html('What are your favorite genres?').css('left', '29%');
      // _('<span>')_
      //         .addClass('style-instructions')
      //         .appendTo('#gel')
      //         .html('Separate genre keywords by a comma and space, please.')
      _('.date-range-submit').html('find shows!').css('top', '68.5%').off('click', _collectFavArtistGetGenres).on('click', _collectKeywords);

      _('.checkbox').get().forEach(function (el) {
        (0, _alias.on)('click', el, function (el) {
          var value = el.target.value;(0, _alias.log)(value);(0, _alias.log)(genres);
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

    var _killCalendarsBuildFavArtistInput = function _killCalendarsBuildFavArtistInput() {
      _('#calContainer').remove();
      _('#gelText').html('Who is your favorite Artist/band?').css({ fontSize: '36px', left: '28%' });
      _("<input type='text'>").addClass('favArtist-input').appendTo(_('#gel'));
      _('.date-range-submit').off('click', _submitFunction).on('click', _collectFavArtistGetGenres).css({ top: '55%' });
    };

    var _submitFunction = function _submitFunction() {
      var start = userData.searchParameters.startDate,
          end = userData.searchParameters.endDate;

      if (start || end === null) {
        userData.searchParameters.startDate = _('.drpInputS').val();
        userData.searchParameters.endDate = _('.drpInputE').val();

        var startDate = userData.searchParameters.startDate,
            endDate = userData.searchParameters.endDate;
        // alert('from ' + startDate + ' to ' + endDate);

        _killCalendarsBuildFavArtistInput();
      } else {
        userData.searchParameters.favArtist = _('#favArtist').val();
        userData.searchParameters.keywords = _('#keywords').val();

        var favArtist = userData.searchParameters.favArtist,
            keywords = userData.searchParameters.keywords;

        alert(favArtist, keywords);
      }
    };

    var elems = _('.date-range-submit');(0, _alias.log)(elems);

    if (elems.length === 0) {
      _('<button>') //create/append submit button,
      .addClass('date-range-submit') //set up event listener for callback Function
      .appendTo(_('#gel')) //define callback
      .html('Submit').on('click', _submitFunction);
    }
  };

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
})();
exports.conStructionModule = conStructionModule;