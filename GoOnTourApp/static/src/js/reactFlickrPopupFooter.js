'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _alias = require('./alias');

var _goOnTourMaps = require('./goOnTourMaps');

var React = require('react');

var Title = React.createClass({
  displayName: 'Title',

  render: function render() {
    return React.createElement(
      'div',
      { className: 'popup-title' },
      React.createElement(
        'p',
        null,
        this.props.data.title
      )
    );
  }
});

var PerformersDate = React.createClass({
  displayName: 'PerformersDate',

  render: function render() {
    return React.createElement(
      'div',
      { className: 'popup-date' },
      React.createElement(
        'p',
        { className: 'date' },
        this.props.data.startTime
      )
    );
  }
});

var DescriptionURL = React.createClass({
  displayName: 'DescriptionURL',

  render: function render() {
    var thine = this;
    (0, _alias.log)(['this', thine]);
    return React.createElement(
      'div',
      { className: 'popup-description-url' },
      React.createElement(
        'p',
        { className: 'description' },
        (function () {
          if (thine.props.data.description === 'null') {
            return "No Description Available.";
          } else {
            return thine.props.data.description;
          }
        })()
      ),
      React.createElement(
        'p',
        { className: 'url' },
        ' URL: ' + this.props.data.url
      )
    );
  }
});

var VenueInfo = React.createClass({
  displayName: 'VenueInfo',

  render: function render() {
    return React.createElement(
      'div',
      { className: 'popup-venue-info' },
      React.createElement(
        'p',
        { className: 'venue-name' },
        'Performing Live at:',
        '  ' + this.props.data.venueName
      ),
      React.createElement(
        'p',
        { className: 'venue-city' },
        'in',
        '  ' + this.props.data.venueCity + ', ' + this.props.data.venueState
      ),
      React.createElement(
        'p',
        { className: 'venue-address' },
        this.props.data.venueAddress
      ),
      React.createElement(
        'p',
        { className: 'venue-url' },
        this.props.data.venueUrl
      )
    );
  }
});

var PopupFooter = React.createClass({
  displayName: 'PopupFooter',

  _handleClick: function _handleClick() {
    var userData = this.props.datum,
        showData = this.props.coords;
    _goOnTourMaps.goOnTourMapsModule.addDestination(userData, showData);
  },

  render: function render() {
    return React.createElement(
      'div',
      { className: 'popup-footer' },
      React.createElement(Title, { data: this.props.data }),
      React.createElement(PerformersDate, { data: this.props.data }),
      React.createElement(DescriptionURL, { data: this.props.data }),
      React.createElement(VenueInfo, { data: this.props.data }),
      React.createElement(
        'button',
        { onClick: this._handleClick, className: 'route' },
        'Route'
      )
    );
  }
});
exports.PopupFooter = PopupFooter;