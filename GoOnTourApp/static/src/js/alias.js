// Aliases for commonly repeated functions.

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var make = function make(tag) {
  return document.createElement(tag);
};

exports.make = make;
var dom = function dom(l) {
  if (l[0] === '#') {
    l = l.slice(1);
    return document.getElementById(l);
  } else if (l[0] === '.') {
    l = l.slice(1);
    return document.getElementsByClassName(l)[0];
  } else {
    return document.getElementsByTagName(l)[0];
  }
};

exports.dom = dom;
var query = function query(l) {
  if (l[0] === '#') {
    l = l.slice(1);
    return document.getElementById(l);
  } else if (l[0] === '.') {
    l = l.slice(1);
    return document.getElementsByClassName(l);
  } else {
    return document.getElementsByTagName(l);
  }
};

exports.query = query;
var put = function put(el, mom) {
  return mom.appendChild(el);
};

exports.put = put;
var kill = function kill(el) {
  if (typeof el === 'string') {
    if (el[0] === '#') {
      el = el.slice(1);
      return document.getElementById(el).parentNode.removeChild(document.getElementById(el));
    } else if (el[0] === '.') {
      el = el.slice(1);
      return document.getElementsByClassName(el)[0].parentNode.removeChild(document.getElementsByClassName(el)[0]);
    } else {
      return document.getElementsByTagName(el)[0].parentNode.removeChild(getElementsByTagName(el)[0]);
    }
  } else {
    return el.parentNode.removeChild(el);
  }
};

exports.kill = kill;
var css = function css(el) {
  if (el[0] === '#') {
    el = el.slice(1);
    return document.getElementById(el).style;
  } else if (el[0] === '.') {
    el = el.slice(1);
    return document.getElementsByClassName(el)[0].style;
  } else {
    return document.getElementsByTagName(el)[0].style;
  }
};

exports.css = css;
// export var once = function(event, el, callback) {  //NOTE once function needs work.
//   if (typeof el === 'string') {
//     if (el[0] === '#') {
//       el = el.slice(1);
//       return (function() {
//         document.getElementById(el).addEventListener(event, function() {
//             callback;
//             off(event, el, callback);
//         });
//       }) ();
//     } else if (el[0] === '.') {
//       var el = el.slice(1);
//       return (function() {
//         document.getElementsByClassName(el)[0].addEventListener(event,
//           callback;
//           off(event, el, callback);
//         );
//       }) ();
//     } else {
//       return (function() {
//         document.getElementsByTagName(el).addEventListener(event,
//            callback;
//            off(event, el, callback);
//          );
//       }) ();
//     }
//   } else {
//     return (function() {
//       el.addEventListener(event,
//         callback;
//         off(event, el, callback);
//       );
//     }) ();
//    }
// };

var on = function on(event, el, callback) {
  if (typeof el === 'string') {
    if (el[0] === '#') {
      el = el.slice(1);
      return document.getElementById(el).addEventListener(event, callback);
    } else if (el[0] === '.') {
      el = el.slice(1);
      return document.getElementsByClassName(el)[0].addEventListener(event, callback);
    } else {
      return document.getElementsByTagName(el).addEventListener(event, callback);
    }
  } else {
    return el.addEventListener(event, callback);
  }
};

exports.on = on;
var off = function off(event, el, callback) {
  if (typeof el === 'string') {
    if (el[0] === '#') {
      el = el.slice(1);
      return document.getElementById(el).removeEventListener(event, callback);
    } else if (el[0] === '.') {
      el = el.slice(1);
      return document.getElementsByClassName(el)[0].removeEventListener(event, callback);
    } else {
      return document.getElementsByTagName(el).removeEventListener(event, callback);
    }
  } else {
    el.removeEventListener(event, callback);
  }
};

exports.off = off;
var log = function log(text) {
  return console.log(text);
};

exports.log = log;
var _xhr = function xhr(data, url, callback, method) {
  _xhr = new XMLHttpRequest();
  _xhr.onloadend = function () {
    callback;
    var response = this.responseText;
  };
  _xhr.open(method, url);
  _xhr.send(data);

  return response;
};
exports.xhr = _xhr;