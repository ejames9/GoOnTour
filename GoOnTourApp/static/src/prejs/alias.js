// Aliases for commonly repeated functions.
require('babel-polyfill');





export var make = function(tag) {
  return document.createElement(tag);
};

export var dom = function(l) {
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

export var query = function(l) {
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


export var put = function(el, mom) {
  return mom.appendChild(el);
};


export var kill = function(el) {
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




export var css = function(el) {
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

// export var once = function(event, el, callback) {  //NOTE:30 once function needs work.
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

export var on = function(event, el, callback) {
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

export var off = function(event, el, callback) {
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


export var log = function(text) {
  return console.log(text);
};

export var sleep = function(milliseconds) {
  var start = new Date().getTime();
  while (true) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
};


export var xhr = function(fd, url, method) {
  log('fd'); log(fd);

  var m = method || 'post';
  var val;

  var ajax = function() {
      let ajax = new XMLHttpRequest();

      ajax.onloadend = function() {
        if (ajax.status === 200) {
          val = this.response;
        }
      };
      ajax.open(m, url, false);
      ajax.send(fd);
  };
  ajax(fd, url, m);
  val = JSON.parse(val); 

  return val;
};
