import * as Map from 'roadiMapbox';
import * as Home from 'homeSlice';

var direct;
var engineButton;
var engineButton2;
var zoomBackButton;
var toolTipsPane;
var id;
var delPane;
var artistPics;
var venuePics;
var refreshIntervalId;
var el;
var length;
var height;
var colors;
var userCoords;
var forHash;



export function buildButtons() {
  direct = document.getElementById('directions');
  engineButton = document.createElement('button');
  engineButton2 = document.createElement('button');
  zoomBackButton = document.createElement('button');
  zoomBackButton.id = 'zoomBackButton';
  engineButton.id = 'engineButton';
  engineButton2.id = 'engineButton2';
  engineButton.innerHTML = '<i class="fa fa-long-arrow-right fa-5x fa-inverse" id="nextDay"></i>';
  engineButton2.innerHTML = '<i class="fa fa-long-arrow-left fa-5x fa-inverse" id="prevDay"></i>';
  zoomBackButton.innerHTML = '<i class="fa fa-rocket fa-4x fa-inverse" id="rocket"></i>';
  direct.appendChild(zoomBackButton);
  direct.appendChild(engineButton);
  direct.appendChild(engineButton2);
  engineButton.addEventListener('click', routeEngine);
  engineButton2.addEventListener('click', reRouteEngine);
  zoomBackButton.addEventListener('click', zoomBackOut);
  engineButton.addEventListener('mouseover', toolTips);
  engineButton2.addEventListener('mouseover', toolTips);
  zoomBackButton.addEventListener('mouseover', toolTips);
};

export function buildMenus() {
  var menu = document.getElementById('menu');
      direct = document.getElementById('directions');

  if (bool) {
    direct.style.width = '180px';
    bool = false;
    menu.innerHTML = ' ><br/>><br/>> ';
  } else {
    direct.style.width = '20px';
    bool = true;
    menu.innerHTML = ' <<br/><<br/>< ';
  }
};

export function displayFlickrPhotos(artistPhotos, venuePhotos) {
  console.log(artistPhotos);
  artistPics = artistPhotos.photos.photo;
  console.log(artistPics);
  var i = Math.floor(Math.random() * 19);
  var footer = document.getElementById('block');
      footer.innerHTML += '<img id="id" src="https://farm' + artistPics[String(i)].farm + '.staticflickr.com/' + artistPics[String(i)].server + '/' + artistPics[String(i)].id + '_' + artistPics[String(i)].secret + '_z.jpg"/>';

  refreshIntervalId = setInterval(function() {
    // var artistPics = artistPhotos.photos.photo
    var j = Math.floor(Math.random() * 19);
    var footer = document.getElementById('block');
    var id = document.getElementById('id');
        footer.removeChild(id);
        footer.innerHTML += '<img id="id" src="https://farm' + artistPics[String(j)].farm + '.staticflickr.com/' + artistPics[String(j)].server + '/' + artistPics[String(j)].id + '_' + artistPics[String(j)].secret + '_z.jpg"/>';
  }, 5000);
  upFooter();
};


export function closeFooterAndKillPics() {
  if (block.style.height === '350px') {
    var id = document.getElementById('id');
    var footer = document.getElementById('block');
    footer.removeChild(id);
    block.style.height = '80px';
    clearInterval(refreshIntervalId);
  }
};


function upFooter() {
  console.log('hello');
  if (block.style.height === '80px') {
    block.style.height = '350px';
    block.style.opacity = '.9';
  }
};



function toolTips(e) {
  var source = e.target.id;
      console.log(source);
      toolTipsPane = document.createElement('div');
  if (source === 'engineButton') {
    if (typeof id !== 'undefined') {
      delPane = document.getElementById(id);
      if (delPane !== null) {
        map = document.getElementById('map');
        map.removeChild(delPane);
      }
    }
  toolTipsPane.innerHTML = 'Set Current Leg and Proceed to Next Day of Trip';
  toolTipsPane.id = 'ttPaneEngine';
  id = toolTipsPane.id;

  } else if (source === 'engineButton2') {
    if (typeof id !== 'undefined') {
      delPane = document.getElementById(id);
      if (delPane !== null) {
        map = document.getElementById('map');
        map.removeChild(delPane);
      }
    }
  toolTipsPane.innerHTML = 'Erase Current Leg and Edit Previous Leg';
  toolTipsPane.id = 'ttPaneEngine2';
  id = toolTipsPane.id;

  } else {
    if (typeof id !== 'undefined') {
      delPane = document.getElementById(id);
      if (delPane != null) {
          var map = document.getElementById('map');
              map.removeChild(delPane);
      }
    }
  toolTipsPane.innerHTML = 'Zoom Back Out';
  toolTipsPane.id = 'ttPaneZoom';
  id = toolTipsPane.id;
  }
  var map = document.getElementById('map');
  console.log(map);
      map.appendChild(toolTipsPane);
      console.log(toolTipsPane);

  if (toolTipsPane != null) {
    setTimeout(function() {
      console.log(toolTipsPane);
      map.removeChild(toolTipsPane);
        }, 3000);
  }
};




export function loadMap(coordinates) {
  forHash = coordinates;
  console.log(coordinates);
  var xhr = new XMLHttpRequest();
      url = '/map/';

  xhr.onloadend = function() {
    var newHTML = this.responseText;

    var lines    = document.getElementById('lines');
    var bundle   = document.getElementById('bundle');
    var body     = document.getElementsByTagName('body')[0];
    var main     = document.getElementsByTagName('main')[0];
    var trashCan = document.getElementById('trashCan');

        if (lines !== null) {
          body.removeChild(lines);
        }
        if (bundle !== null) {
          body.removeChild(bundle);
        }
        main.removeChild(trashCan);
        main.innerHTML = newHTML;

    if (coordinates !== 0) {
      userCoords = coordinates;
      initMap(userCoords);
    } else {
      mapUser();
    }
  };
  xhr.open('GET', url);
  xhr.send(null);
};



export function homeReload() {
  var xhr = new XMLHttpRequest();
      url = '';

  var formData = new FormData();
  formData.append('reload', 'homeMain.html');

  xhr.onloadend = function() {
    var newHTML = this.responseText;

        console.log(newHTML);

    var body      = document.getElementsByTagName('body')[0];
    var trashCan  = document.getElementById('trashCan');
    var homeSlice = document.getElementById('homeSlice');
    var main      = document.getElementsByTagName('main')[0];
    var lines     = document.getElementById('lines');

    main.removeChild(trashCan);
    main.innerHTML = newHTML;

    var bundle      = document.createElement('script');
        bundle.type = 'text/JavaScript';
        bundle.src  = '/static/roadi/bundle.js'
        bundle.id   = 'bundle';

    body.insertBefore(bundle, homeSlice);
    initSPIMain();
  };
  xhr.open('POST', url);
  xhr.send(formData);
}
