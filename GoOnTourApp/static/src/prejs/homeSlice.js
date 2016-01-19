// homeSlice, JavaScript Module for GoOnTour.org. Deals mainly with
// Home Page Navigation
import { put, dom, css, on, off, log, make, kill, query } from './alias';
import { conStructionModule as Construct }  from './conStruction';
import { goOnTourMapsModule as Map } from './goOnTourMaps';



export var homeSliceModule =  (function() {

  var homeHashBool = true;


  var findShows = function(userData) {
    var findShowsButton = dom('#circle');
               var body = dom('body');
     var planTourButton = dom('#circle2');
var startLocationInput1 = dom('.input1');
              var lines = make('div');

                  lines.setAttribute('class', 'lines');

               css('#circle2').display = 'none';
                css('#input1').display = 'block';
                 css('#arrow').display = 'block';

                  put(lines, body);


    // off('click', '#circle', findShows);
    on('click', findShowsButton, restoreHomeButtons);
    on('click', '#arrow', function() {
      Construct.loadMap(0, userData);
    });

  };

  var restoreHomeButtons = function() {
    var findShowsButton = dom('#circle');
              var lines = dom('.lines');

         css('#circle2').display = 'block';
         css('#input1').display = 'none';
         css('#arrow').display = 'none';


     if (lines) {
        lines = query('.lines');
        while (lines.length > 0) {
          lines[0].parentNode.removeChild(lines[0]);
        }
      }
     off('click', findShowsButton, restoreHomeButtons);
    //  on('click', findShowsButton, findShows);
  };

  var sunSetScroll = function() {
    var h, s, l,
    colors = [
      [194, 51, 79], [194, 51, 79], [194, 51, 79], [194, 51, 79],
      [356, 51, 79], [356, 51, 79], [356, 51, 79], [356, 51, 79], [356, 51, 79],
      [267, 51, 79], [267, 51, 79], [267, 51, 79], [267, 51, 79], [267, 51, 79], [267, 51, 79],
      [264, 100, 21], [264, 100, 21], [264, 100, 21]
    ],
    el = dom('.parallax'),   // Element to be scrolled
    length = colors.length,                      // Number of colors
    height = 500;
       // Height of the segment between two colors
    var i = Math.floor(el.scrollTop / height),     // Start color index
        d = el.scrollTop % height / height,        // Which part of the segment between start color and end color is passed
        c1 = colors[i],                            // Start color
        c2 = colors[(i + 1) % length];                // End color
        if (c1 && c2) {
          h = c1[0] + Math.round((c2[0] - c1[0]) * d),
          s = c1[1] + Math.round((c2[1] - c1[1]) * d),
          l = c1[2] + Math.round((c2[2] - c1[2]) * d),
          el.style['background-color'] = ['hsl(', h, ', ', s+'%, ', l, '%)'].join('');
        }
  };

  var initHome = function(userData) {
    //   log('initiate');
    // if (homeHashBool === true) {
    //   log(homeHashBool);
    //   window.location.hash = '';
    //   homeHashBool = false;
    // }
    // Map.mapHashBool = true;

    var findShowsButton = dom('#circle');
    log(findShowsButton);

    if (typeof findShowsButton !== 'undefined') {
      on('click', '#circle', function() {
        findShows(userData);
      });
    }
  };


  return {
    findShows: findShows,
    restoreHomeButtons: restoreHomeButtons,
    sunSetScroll: sunSetScroll,
    initHome: initHome
  };


}) ();
