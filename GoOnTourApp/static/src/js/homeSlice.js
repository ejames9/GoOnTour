// homeSlice, JavaScript Module for GoOnTour.org. Deals mainly with
// Home Page Navigation
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _alias = require('./alias');

var _conStruction = require('./conStruction');

// import { goOnTourMapsModule as Map } from './goOnTourMaps';

var homeSliceModule = (function () {

  var homeHashBool = true;

  var findShows = function findShows() {
    var findShowsButton = (0, _alias.dom)('#circle');
    var body = (0, _alias.dom)('body');
    var planTourButton = (0, _alias.dom)('#circle2');
    var startLocationInput1 = (0, _alias.dom)('.input1');
    var lines = (0, _alias.make)('div');

    lines.id = 'lines';
    (0, _alias.css)('#circle2').display = 'none';
    (0, _alias.css)('#input1').display = 'block';
    (0, _alias.css)('#arrow').display = 'block';

    (0, _alias.put)(lines, body);

    (0, _alias.off)('click', findShowsButton, findShows);
    (0, _alias.on)('click', findShowsButton, restoreHomeButtons);
    (0, _alias.on)('click', '#arrow', function () {
      _conStruction.conStructionModule.loadMap(0);
    });
  };

  var restoreHomeButtons = function restoreHomeButtons() {
    var findShowsButton = (0, _alias.dom)('#circle');
    var lines = (0, _alias.dom)('#lines');

    (0, _alias.css)('#circle2').display = 'block';
    (0, _alias.css)('#input1').display = 'none';
    (0, _alias.css)('#arrow').display = 'none';

    if (lines) {
      (0, _alias.kill)(lines);
    }

    (0, _alias.on)('click', findShowsButton, findShows);
  };

  var sunSetScroll = function sunSetScroll() {
    var h,
        s,
        l,
        colors = [[194, 51, 79], [194, 51, 79], [194, 51, 79], [194, 51, 79], [356, 51, 79], [356, 51, 79], [356, 51, 79], [356, 51, 79], [356, 51, 79], [267, 51, 79], [267, 51, 79], [267, 51, 79], [267, 51, 79], [267, 51, 79], [267, 51, 79], [264, 100, 21], [264, 100, 21], [264, 100, 21]],
        el = (0, _alias.dom)('.parallax'),
        // Element to be scrolled
    length = colors.length,
        // Number of colors
    height = 500;
    // Height of the segment between two colors
    var i = Math.floor(el.scrollTop / height),
        // Start color index
    d = el.scrollTop % height / height,
        // Which part of the segment between start color and end color is passed
    c1 = colors[i],
        // Start color
    c2 = colors[(i + 1) % length]; // End color
    if (c1 && c2) {
      h = c1[0] + Math.round((c2[0] - c1[0]) * d), s = c1[1] + Math.round((c2[1] - c1[1]) * d), l = c1[2] + Math.round((c2[2] - c1[2]) * d), el.style['background-color'] = ['hsl(', h, ', ', s + '%, ', l, '%)'].join('');
    }
  };

  var initHome = function initHome() {
    (0, _alias.log)('initiate');
    if (homeHashBool === true) {
      (0, _alias.log)(homeHashBool);
      window.location.hash = '';
      homeHashBool = false;
    }
    Map.mapHashBool = true;

    var findShowsButton = (0, _alias.dom)('#circle');
    (0, _alias.log)(findShowsButton);

    if (typeof findShowsButton !== 'undefined') {
      (0, _alias.on)('click', '#circle', findShows);
    }
  };

  return {
    findShows: findShows,
    restoreHomeButtons: restoreHomeButtons,
    sunSetScroll: sunSetScroll,
    initHome: initHome
  };
})();
exports.homeSliceModule = homeSliceModule;