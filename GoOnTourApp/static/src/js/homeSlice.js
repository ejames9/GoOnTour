// homeSlice, JavaScript Module for GoOnTour.org. Deals mainly with
// Home Page Navigation
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _alias = require('./alias');

var _conStruction = require('./conStruction');

var _goOnTourMaps = require('./goOnTourMaps');

var homeSliceModule = (function () {

  var homeHashBool = true;

  //This function controls interaction with the two main home page buttons, The find shows button, and the plan tour button.
  var findShows = function findShows(userData) {
    var findShowsButton = (0, _alias.dom)('#circle');
    var body = (0, _alias.dom)('body');
    var planTourButton = (0, _alias.dom)('#circle2');
    var startLocationInput1 = (0, _alias.dom)('.input1');
    var lines = (0, _alias.make)('div');

    lines.setAttribute('class', 'lines');

    (0, _alias.css)('#circle2').display = 'none';
    (0, _alias.css)('#input1').display = 'block';
    (0, _alias.css)('#arrow').display = 'block';

    (0, _alias.put)(lines, body);

    // off('click', '#circle', findShows);             //Event listeners for the buttons.
    (0, _alias.on)('click', findShowsButton, restoreHomeButtons);
    (0, _alias.on)('click', '#arrow', function () {
      _conStruction.conStructionModule.loadMap(0, userData);
    });
  };

  //This function restores the main home page buttons to original state.
  var restoreHomeButtons = function restoreHomeButtons() {
    var findShowsButton = (0, _alias.dom)('#circle');
    var lines = (0, _alias.dom)('.lines');

    (0, _alias.css)('#circle2').display = 'block';
    (0, _alias.css)('#input1').display = 'none';
    (0, _alias.css)('#arrow').display = 'none';

    if (lines) {
      lines = (0, _alias.query)('.lines');
      while (lines.length > 0) {
        lines[0].parentNode.removeChild(lines[0]);
      }
    }
    (0, _alias.off)('click', findShowsButton, restoreHomeButtons); //Listeners.
    //  on('click', findShowsButton, findShows);
  };

  //This function changes the background-color of the .parallax element on scroll.
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

  //Home page initialization function. At this point, all is really does is set an event listener on the find shows button. It will eventually include
  //code for setting hash, which will be useful for single-page app navigation. A previous attempt at this is commented-out.
  var initHome = function initHome(userData) {
    (0, _alias.log)('initiate');
    if (homeHashBool === true) {
      (0, _alias.log)(homeHashBool);
      window.location.hash = '';
      homeHashBool = false;
    }
    _goOnTourMaps.goOnTourMapsModule.mapHashBool = true;

    var findShowsButton = (0, _alias.dom)('#circle');
    (0, _alias.log)(findShowsButton);

    if (typeof findShowsButton !== 'undefined') {
      (0, _alias.on)('click', '#circle', function () {
        findShows(userData);
      });
    }
  };

  //The modules' public functions.
  return {
    findShows: findShows,
    restoreHomeButtons: restoreHomeButtons,
    sunSetScroll: sunSetScroll,
    initHome: initHome
  };
})();
exports.homeSliceModule = homeSliceModule;