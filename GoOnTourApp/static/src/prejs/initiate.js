import { on, log, dom } from './alias';
import { homeSliceModule as Home } from './homeSlice';
import { reactGeocoder } from './reactGeocoder';


(function() {
  log('a-step-a 1');


  on('DOMContentLoaded', document, Home.initHome);
  on('scroll', '.parallax', Home.sunSetScroll);

}) ();
