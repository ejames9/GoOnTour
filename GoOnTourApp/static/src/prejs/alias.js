// Aliases for commonly repeated functions.
require('babel-polyfill');




//Create element alias function.
export var make = function(tag) {
  return document.createElement(tag);
};

//DOM querying alias function. Will automatically narrow class or tag queries down to one result. It will not return an array.
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

//DOM querying function, same as above, but it will return an array if a tag or class name are given as argument.
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

//Function for appending elements to other elements.
export var put = function(el, mom) {
  return mom.appendChild(el);
};

//Function for deleting elements from the DOM tree.
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


//Function for setting css style properties of elements.
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


//NOTE:30 once function needs work.

// export var once = function(event, el, callback) {
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

//Function for setting event listeners.
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

//Function for removing event listeners.
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

//Console.log alias function.
export var log = function(text) {
  return console.log(text);
};

//This practically useless function will lock up the browser for a preset amount of time.
export var sleep = function(milliseconds) {
  var start = new Date().getTime();
  while (true) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
};

//This is an alias function for XMLHttpRequests.
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
