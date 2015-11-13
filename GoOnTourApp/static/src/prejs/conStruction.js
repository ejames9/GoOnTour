
//conStruction.js JavaScript Module for GoOnTour.org. Deals mainly with DOM Elements.


import { make, put, kill, dom, css, on, off, log } from './alias';
import { goOnTourMapsModule as Map } from './goOnTourMaps';
import { homeSliceModule as Home } from './homeSlice';
import { DatePicker } from './reactDateRangePicker2';


var React = require('react/addons');


export const conStructionModule = (function() {

  var artistPics;
  var venuePics;
  var el;
  var refreshIntervalId;
  var toolTipsPane;
  var id;
  var delpane;
  var forHash;
  var userCoords;

  var buildButtons = function() {
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
        on('click', engineButton, Map.routeEngine);
        on('click', engineButton2, Map.reRouteEngine);
        on('click', zoomBackButton, Map.zoomBackOut);
        on('mouseover', engineButton, toolTips);
        on('mouseover', engineButton2, toolTips);
        on('mouseover', zoomBackButton, toolTips);
  };

  var buildMenus = function() {
    log(Map.bool);
    var menu = dom('#menu');
    var direct = dom('#directions');

    if (Map.bool) {  //#TODO:0 Need a solution for Map.bool
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


  var displayFlickrPhotos = function(artistPhotos, venuePhotos) {
    log(artistPhotos);
    artistPics = artistPhotos.photos.photo;     log(artistPics);

    var i = Math.floor(Math.random() * 19);
    var footer = dom('#block');
        footer.innerHTML += '<img id="id" src="https://farm' + artistPics[String(i)].farm + '.staticflickr.com/' + artistPics[String(i)].server + '/' + artistPics[String(i)].id + '_' + artistPics[String(i)].secret + '_z.jpg"/>';

    refreshIntervalId = setInterval(function() {  //NOTE This may not work.
      // var artistPics = artistPhotos.photos.photo
      var j = Math.floor(Math.random() * 19);
      var footer = dom('#block');
                  kill('#id');
          footer.innerHTML += '<img id="id" src="https://farm' + artistPics[String(j)].farm + '.staticflickr.com/' + artistPics[String(j)].server + '/' + artistPics[String(j)].id + '_' + artistPics[String(j)].secret + '_z.jpg"/>';
    }, 5000);
    upFooter();
  };

  var closeFooterAndKillPics = function() {
    var footer = css('#block');
    if (footer.height === '350px') {
      kill('#id'); footer.height = '80px';
      clearInterval(refreshIntervalId);
    }
  };

  var upFooter = function() {
    log('hello');
    var footer = css('#block');
    if (footer.height === '80px') {
      footer.height = '350px';
      footer.opacity = '.9';
    }
  };


  // function toolTips(e) {
  //   var source = e.target.id;     log(source);
  //       toolTipsPane = make('div');
  //   if (source === 'engineButton') {
  //     if (typeof id !== 'undefined') {
  //       delPane = dom(id);
  //       if (delPane !== null) {
  //         kill(id);
  //       }
  //     }
  //   toolTipsPane.innerHTML = 'Set Current Leg and Proceed to Next Day of Trip';
  //   toolTipsPane.id = 'ttPaneEngine';
  //   id = '#ttPaneEngine';
  //
  //   } else if (source === 'engineButton2') {
  //     if (typeof id !== 'undefined') {
  //       delPane = dom(id);
  //       if (delPane !== null) {
  //         kill(id);
  //       }
  //     }
  //   toolTipsPane.innerHTML = 'Erase Current Leg and Edit Previous Leg';
  //   toolTipsPane.id = 'ttPaneEngine2';
  //   id = 'ttPaneEngine2';
  //
  //   } else {
  //     if (typeof id !== 'undefined') {
  //       delPane = dom(id);
  //       if (delPane !== null) {
  //           kill(id);
  //       }
  //     }
  //   toolTipsPane.innerHTML = 'Zoom Back Out';
  //   toolTipsPane.id = 'ttPaneZoom';
  //   id = 'ttPaneZoom';
  //   }
  //   put(toolTipsPane);
  //   log(toolTipsPane);
  //
  //   if (toolTipsPane !== null) {
  //     setTimeout(function() {
  //        log(toolTipsPane);
  //       kill(toolTipsPane);
  //     }, 3000); //NOTE May have problems with this function.
  //   }
  // };


  var loadMap = function(coordinates) {
    forHash = coordinates;        log(coordinates);

    var xhr = new XMLHttpRequest();
    var url = '/map/';

    xhr.onloadend = function() {
      var newHTML = this.responseText;

      var lines    = dom('#lines');
      var bundle   = dom('#bundle');
      var main     = dom('main');
      var trashCan = dom('#trashCan');

          if (lines !== null) {
            kill(lines);
          }
          // if (bundle !== null) {
          //   kill(bundle);
          // }
          kill('#trashCan');
          main.innerHTML = newHTML;

      var reactDRP = React.createFactory(DatePicker);
          React.render(
            reactDRP(),
            dom('#app')
         );

      if (coordinates !== 0) {  //NOTE Removed this assignment => userCoords = coordinates;
        log('!0');
        Map.initMap(coordinates);
      } else {
        log('0');
        Map.getUser();

      }
    };
    xhr.open('GET', url);
    xhr.send(null);


  };


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
      initHome();
    };
    xhr.open('POST', url);
    xhr.send(formData);
  };

  return {
    forHash: forHash,
    buildButtons: buildButtons,
    buildMenus: buildMenus,
    displayFlickrPhotos: displayFlickrPhotos,
    closeFooterAndKillPics: closeFooterAndKillPics,
    loadMap: loadMap,
    homeReload: homeReload
  };

}) ();
