
//Initiation Module, Needed as a bundling entry point for webpack.
//My ES6 Modules
'use strict';

var _alias = require('./alias');

var _homeSlice = require('./homeSlice');

var _reactGeocoder = require('./reactGeocoder');

var _reactDateRangePicker2 = require('./reactDateRangePicker2');

//Vendor Modules, CommonJS Style.
var React = require('react/addons');

//Boolean Flags.
window.locationFlag = true;

//Some
(function () {

  var userData = {}; //User Data Object.

  (0, _alias.log)('a-step-a whaan');

  //When DOM is loaded, run Home Screen init function.
  (0, _alias.on)('DOMContentLoaded', document, function () {
    _homeSlice.homeSliceModule.initHome(userData);
  });
  //Event listener for Home screen sunset feature.
  (0, _alias.on)('scroll', '.parallax', _homeSlice.homeSliceModule.sunSetScroll);

  //Load the DatePicker into an invisible element, that will be made visible when needed.
  var reactDRP = React.createElement(_reactDateRangePicker2.DatePicker);
  React.render(reactDRP, (0, _alias.dom)('#app'));
})();