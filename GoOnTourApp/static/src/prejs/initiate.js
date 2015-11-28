import { on, log, dom } from './alias';
import { homeSliceModule as Home } from './homeSlice';
import { reactGeocoder } from './reactGeocoder';
import { DatePicker } from './reactDateRangePicker2';

var React = require('react/addons');



(function() {
  log('a-step-a 1');


  on('DOMContentLoaded', document, Home.initHome);
  on('scroll', '.parallax', Home.sunSetScroll);

  var reactDRP = React.createElement(DatePicker);
      React.render(
       reactDRP,
        dom('#app')
     );

}) ();
