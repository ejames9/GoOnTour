
//Initiation Module, Needed as a bundling entry point.
//My ES6 Modules
import { on, log, dom } from './alias';
import { homeSliceModule as Home } from './homeSlice';
import { reactGeocoder } from './reactGeocoder';
import { DatePicker } from './reactDateRangePicker2';

//Vendor Modules, CommonJS Style.
var React = require('react/addons');

//Boolean Flags.
window.locationFlag = true;



(function() {

  var userData = {};

  log('a-step-a 1');


  on('DOMContentLoaded', document, function() {
    Home.initHome(userData);
  });
  on('scroll', '.parallax', Home.sunSetScroll);

  var reactDRP = React.createElement(DatePicker);
      React.render(
       reactDRP,
        dom('#app')
     );

}) ();
