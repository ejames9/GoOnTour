'use strict';

var _alias = require('./alias');

var _homeSlice = require('./homeSlice');

var _reactGeocoder = require('./reactGeocoder');

var _reactDateRangePicker2 = require('./reactDateRangePicker2');

var React = require('react/addons');

(function () {

  var userData = {};

  (0, _alias.log)('a-step-a 1');

  (0, _alias.on)('DOMContentLoaded', document, function () {
    _homeSlice.homeSliceModule.initHome(userData);
  });
  (0, _alias.on)('scroll', '.parallax', _homeSlice.homeSliceModule.sunSetScroll);

  var reactDRP = React.createElement(_reactDateRangePicker2.DatePicker);
  React.render(reactDRP, (0, _alias.dom)('#app'));
})();