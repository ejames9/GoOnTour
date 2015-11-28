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
    this.setState({ value: value });
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
    var that = this;
    var a = document.getElementsByTagName('a');
    for (var i = 0; i < a.length; i++) {
      a[i].addEventListener('mouseover', function (e) {
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
            (0, _alias.log)(thine.locText);
            var tTip = (0, _alias.make)('div');
            tTip.className = 'tTip';
            tTip.innerText = thine.locText;
            (0, _alias.log)(thine.element);
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
React.render(React.createElement(reactGeocoder, null), (0, _alias.dom)('#input1'));
/* Geocoder:
   accessToken -- Mapbox developer access token (required)
   onSelect    -- function called after selecting result (required)
   showLoader  -- Boolean to attach `.loading` class to results list
*/