// JavaScript file for GoOnTour.com Homepage Navigation
import * as Construct from 'conStruction';
import * as Map from 'roadiMapbox';


var homeHashBool = true;

function findShows() {
      var findShowsButton = document.getElementById('circle');
                 var body = document.getElementsByTagName('body')[0];
       var planTourButton = document.getElementById('circle2');
   var startLocationInput = document.getElementById('input1');
  var startLocationInput1 = document.getElementsByClassName('input1')[0];
                var arrow = document.getElementById('arrow');
                var lines = document.createElement('div');

                   lines.id            = 'lines';
          planTourButton.style.display = 'none';
      startLocationInput.style.display = 'block';
                   arrow.style.display = 'block';

                    body.appendChild(lines);


      findShowsButton.removeEventListener('click', findShows);
      findShowsButton.addEventListener('click', restoreHomeButtons);
                arrow.addEventListener('click', function() {
                          Construct.loadMap(0);
                });
};


function restoreHomeButtons() {
     var findShowsButton = document.getElementById('circle');
                var body = document.getElementsByTagName('body')[0];
      var planTourButton = document.getElementById('circle2');
  var startLocationInput = document.getElementById('input1');
               var arrow = document.getElementById('arrow');
               var lines = document.getElementById('lines');

          planTourButton.style.display = 'block';
      startLocationInput.style.display = 'none';
                   arrow.style.display = 'none';

      if (lines) {
        body.removeChild(lines);
                 };

      findShowsButton.addEventListener('click', findShows);
};


function sunSetScroll() {
  colors = [
    [194, 51, 79], [194, 51, 79], [194, 51, 79], [194, 51, 79],
    [356, 51, 79], [356, 51, 79], [356, 51, 79], [356, 51, 79], [356, 51, 79],
    [267, 51, 79], [267, 51, 79], [267, 51, 79], [267, 51, 79], [267, 51, 79], [267, 51, 79],
    [264, 100, 21], [264, 100, 21], [264, 100, 21]
  ];

  el = document.getElementsByClassName('parallax')[0];   // Element to be scrolled
  length = colors.length;                        // Number of colors
  height = 500;
     // Height of the segment between two colors
  var i = Math.floor(el.scrollTop / height),     // Start color index
      d = el.scrollTop % height / height,        // Which part of the segment between start color and end color is passed
      c1 = colors[i],                            // Start color
      c2 = colors[(i + 1) % length];                // End color
      if (c1 && c2) {
        h = c1[0] + Math.round((c2[0] - c1[0]) * d),
        s = c1[1] + Math.round((c2[1] - c1[1]) * d),
        l = c1[2] + Math.round((c2[2] - c1[2]) * d);
        el.style['background-color'] = ['hsl(', h, ', ', s+'%, ', l, '%)'].join('');
      }
};


function initSPIHome() {
  if (homeHashBool === true) {
    console.log(homeHashBool);
    window.location.hash = '';
    homeHashBool = false;
  }
  mapHashBool = true;

  var findShowsButton = document.getElementById('circle');
      if (typeof findShowsButton !== 'undefined') {
        findShowsButton.addEventListener('click', findShows);
      }
};

document.addEventListener('DOMContentLoaded', initSPIHome);

export {initSPIHome}
