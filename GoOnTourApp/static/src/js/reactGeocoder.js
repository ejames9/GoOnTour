
//This file incorporates the reactGeocoder into the HomePage.

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _alias = require('./alias');

var _conStruction = require('./conStruction');

// var ReactDOM = require('react-dom'),
var React = require('react'),
    Geocoder = require('react-geocoder');

var reactGeocoder = React.createClass({
  displayName: 'reactGeocoder',

  locText: null,
  element: null,

  checkOverFlow: function checkOverFlow(l) {
    //This function checks to see if the result element is overflowing with text or not.
    var elOverFlow = l.style.overflow;
    if (!elOverFlow || elOverFlow === 'visible') {
      l.style.overflow = 'hidden';
    }
    var isOverFlowing = l.clientWidth < l.scrollWidth || l.clientHeight < l.scrollHeight;

    l.style.overflow = elOverFlow;
    return isOverFlowing;
  },

  getInitialState: function getInitialState() {
    return { value: null };
  },
  onSelect: function onSelect(value) {
    //This function handles select of a geocoder result. After deleting all tooltips, it calls loadMap() from
    this.setState({ value: value }); //the conStructionModule with the lat, lng coordinates of the result.
    (0, _alias.log)(value.center);
    var t = document.getElementsByClassName('tTip');
    (0, _alias.log)(t.length);
    if (t.length !== 0) {
      (0, _alias.log)(t);
      while (t.length > 0) {
        for (var i = 0; i < t.length; i++) {
          t[i].parentNode.removeChild(t[i]);
        }
      }
    }
    _conStruction.conStructionModule.loadMap(value.center);
  },
  onSuggest: function onSuggest() {
    //This function handles the onSuggest event of the geocoder. This was the best point to implement tooltips
    var that = this; //for the search results.
    var a = document.getElementsByTagName('a');
    for (var i = 0; i < a.length; i++) {
      //This loop uses the checkOverFlow() function to check that all results are fully displayed in their elements.
      a[i].addEventListener('mouseover', function (e) {
        //otherwise, a tooltip showing the full text of the result is displayed for a set period of time, then deleted.
        (0, _alias.log)(that.checkOverFlow);
        if (that.checkOverFlow(e.target)) {
          var thine = this;
          thine.element = e.target.parentNode;
          thine.locText = e.target.textContent;
          var t = document.getElementsByClassName('tTip');
          (0, _alias.log)(t.length);
          if (t.length !== 0) {
            (0, _alias.log)(t);
            while (t.length > 0) {
              for (var i = 0; i < t.length; i++) {
                t[i].parentNode.removeChild(t[i]);
              }
            }
          }
          setTimeout(function () {
            //Tooltips are a pain in the ass.
            (0, _alias.log)(thine.locText);
            var tTip = (0, _alias.make)('div');
            tTip.className = 'tTip';
            (0, _alias.log)(['tt', thine.locText]);
            tTip.innerHTML = thine.locText;
            (0, _alias.log)([tTip, thine.element]);
            thine.element.appendChild(tTip);
          }, 1000);
          setTimeout(function () {
            var t = document.getElementsByClassName('tTip');
            (0, _alias.log)(t.length);
            if (t.length !== 0) {
              (0, _alias.log)(t);
              while (t.length > 0) {
                for (var i = 0; i < t.length; i++) {
                  t[i].parentNode.removeChild(t[i]);
                }
              }
            }
          }, 3000);
        }
      });
    }
  },
  render: function render() {
    /* jshint ignore:start */
    return React.createElement(
      'div',
      null,
      React.createElement(
        'div',
        { className: 'clearfix pad1' },
        React.createElement(Geocoder, {
          accessToken: 'pk.eyJ1IjoidG1jdyIsImEiOiJIZmRUQjRBIn0.lRARalfaGHnPdRcc-7QZYQ',
          inputClass: 'input1',
          resultClass: 'result',
          resultsClass: 'results',
          inputPlaceholder: 'starting location',
          onSelect: this.onSelect,
          onSuggest: this.onSuggest,
          showLoader: true
        })
      ),
      this.state.value && React.createElement(
        'pre',
        { className: 'keyline-all' },
        JSON.stringify(this.state.value, null, 2)
      )
    );
    /* jshint ignore:end */
  }
});

exports.reactGeocoder = reactGeocoder;
React.render(React.createElement(reactGeocoder, null), (0, _alias.dom)('#input1')); //Add GeoCoder to #input1 element.
/* Geocoder:
   accessToken -- Mapbox developer access token (required)
   onSelect    -- function called after selecting result (required)
   showLoader  -- Boolean to attach `.loading` class to results list
*/