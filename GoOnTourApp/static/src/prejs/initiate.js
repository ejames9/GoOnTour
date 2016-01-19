
//Initiation Module, Needed as a bundling entry point for webpack.
//My ES6 Modules
import { on, log, dom } from './alias';
import { homeSliceModule as Home } from './homeSlice';
import { reactGeocoder } from './reactGeocoder';
import { DatePicker } from './reactDateRangePicker2';

//Vendor Modules, CommonJS Style.
var React = require('react/addons');

//Boolean Flags.
window.locationFlag = true;


//Some
(function() {

  var userData = {}; //User Data Object.

  log('a-step-a whaan');

  //When DOM is loaded, run Home Screen init function.
  on('DOMContentLoaded', document, function() {
    Home.initHome(userData);
  });
  //Event listener for Home screen sunset feature.
  on('scroll', '.parallax', Home.sunSetScroll);

  //Load the DatePicker into an invisible element, that will be made visible when needed.
  var reactDRP = React.createElement(DatePicker);
      React.render(
       reactDRP,
        dom('#app')
     );

}) ();
