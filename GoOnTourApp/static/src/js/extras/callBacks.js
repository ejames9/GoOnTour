
//This module exists purely to provide accesible functions to external modules,
//provided out of context, due to entry-point dependency errors.
import jquery from 'jquery'; var el = jquery;
import { conStructionModule as Construct } from './conStruction';
import { log } from './alias';


export const callBackModule = (function() {

  var reactDRPSubmit = function() {
    
  };

  return {
    reactDRPSubmit: reactDRPSubmit
  };

}) ();
