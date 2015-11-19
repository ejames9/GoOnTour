'use strict';

var _alias = require('./alias');

var _homeSlice = require('./homeSlice');

var _reactGeocoder = require('./reactGeocoder');

(function () {
  (0, _alias.log)('a-step-a 1');

  (0, _alias.on)('DOMContentLoaded', document, _homeSlice.homeSliceModule.initHome);
  (0, _alias.on)('scroll', '.parallax', _homeSlice.homeSliceModule.sunSetScroll);
})();