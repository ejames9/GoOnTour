import { on, log, dom, kill, make } from './alias';
import { conStructionModule as Construct } from './conStruction';

// var ReactDOM = require('react-dom'),
  var React  = require('react'),
    Geocoder = require('react-geocoder');

export var reactGeocoder = React.createClass({

  locText: null,
  element: null,

  checkOverFlow: function(el) {
    var elOverFlow = el.style.overflow;
    if (!elOverFlow || elOverFlow === 'visible') {
      el.style.overflow = 'hidden';
    }
    var isOverFlowing = el.clientWidth < el.scrollWidth ||
    el.clientHeight < el.scrollHeight;

    el.style.overflow = elOverFlow;
    return isOverFlowing;
  },

  getInitialState: function() {
    return { value: null };
  },
  onSelect: function(value) {
    this.setState({ value: value });
    log(value.center);
    var t = document.getElementsByClassName('tTip');
    log(t.length);
    if (t.length !== 0) {
      log(t);
      while (t.length > 0) {
        for (var i = 0; i < t.length; i++) {
          t[i].parentNode.removeChild(t[i]);
        }
      }
    }
    Construct.loadMap(value.center);
  },
  onSuggest: function() {
    var that = this;
    var a = document.getElementsByTagName('a');
    for (var i = 0; i < a.length; i++) {
      a[i].addEventListener('mouseover', function(e) {
        log(that.checkOverFlow);
        if (that.checkOverFlow(e.target)) {
          var thine = this;
          thine.element = e.target.parentNode;
          thine.locText = e.target.textContent;
          var t = document.getElementsByClassName('tTip');
          log(t.length);
          if (t.length !== 0) {
            log(t);
            while (t.length > 0) {
              for (var i = 0; i < t.length; i++) {
                t[i].parentNode.removeChild(t[i]);
              }
            }
          }
          setTimeout(function() {
            log(thine.locText);
            var tTip = make('div');
            tTip.className = 'tTip';
            tTip.innerText = thine.locText;
            log(thine.element);
            thine.element.appendChild(tTip);
          }, 1000);
          setTimeout(function() {
            var t = document.getElementsByClassName('tTip');
            log(t.length);
            if (t.length !== 0) {
              log(t);
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
  render: function() {
    /* jshint ignore:start */
    return (
      <div>
        <div className='clearfix pad1'>
          {/* Geocoder:
              accessToken -- Mapbox developer access token (required)
              onSelect    -- function called after selecting result (required)
              showLoader  -- Boolean to attach `.loading` class to results list
          */}
          <Geocoder
            accessToken='pk.eyJ1IjoidG1jdyIsImEiOiJIZmRUQjRBIn0.lRARalfaGHnPdRcc-7QZYQ'
            inputClass='input1'
            resultClass='result'
            resultsClass='results'
            inputPlaceholder='starting location'
            onSelect={this.onSelect}
            onSuggest={this.onSuggest}
            showLoader={true}
            />
        </div>
        {this.state.value && <pre className='keyline-all'>{JSON.stringify(this.state.value, null, 2)}</pre>}
      </div>
    );
    /* jshint ignore:end */
  }
});

React.render(React.createElement(reactGeocoder, null), dom('#input1'));
