// 3D Graphics Module, using Three.js

// var THREE = require('three.js');
            // require('./node_modules/three.js/build/CSS3DRenderer');
import { log } from './alias';


export const threeDModule = (function() {

  var scene,
      camera,
      sphereObj,
      webGLRenderer,
      css3DRenderer,
      token = 'pk.eyJ1IjoiZWphbWVzOSIsImEiOiIyNGNlYWUyYTU4M2Q4YTViYWM0YTBlMDRmNzIyMTYyNCJ9.RbU_-nlAAF6EOSVxj1kVMg';


  var renderThreeDMap = function(coordinates) {
    // set the scene size
    var width = 1600,
       height = 1600;
    // set some camera attributes
    var fov = 45,
           aspect = width / height,
             near = 0.1,
              far = 10000;
    // get the DOM element to attach to
    var _container = document.getElementById('container');

        css3DRenderer = new THREE.CSS3DRenderer();
        css3DRenderer.setSize(width, height);

        camera = new THREE.PerspectiveCamera(
          fov,
          width / height,
          near,
          far
        );
    scene = new THREE.Scene();
    // add the camera to the scene
    scene.add(camera);
    // the camera starts at 0,0,0, so pull it back
    camera.position.z = 1260;
    camera.position.x = -80;
    camera.position.y = -230;

    // attach the render-supplied DOM element
    _container.appendChild(css3DRenderer.domElement);
    // Create map div, give it an #id and append it to body
    var mapDiv = document.createElement('div');
        mapDiv.id           = 'map';
        mapDiv.className    = 'custom-popup';
        mapDiv.style.height = '1600px';
        mapDiv.style.width  = '1600px';

        document.body.appendChild(mapDiv);

    // Initialize map in map div
        L.mapbox.accessToken = token;

    if (coordinates === null) {
      this.map = L.mapbox.map('map', 'mapbox.streets-satellite').setView([45.12, -86.69], 5);
    } else {
      this.map = L.mapbox.map('map', 'mapbox.streets-satellite').setView(coordinates, 7);
    }

    this.map.on('click', function(e) {
      alert(e.latlng.toString() + ', ' +  e.containerPoint.toString() + ', and: ' + e.clientX + ', ' + e.clientY);
    });
    // document.getElementsByClassName('marker')[0].addEventListener('click', function(e) {
    //   alert(e.clientX + ', ' + e.clientY);
    // });

    // Snippet I got from a Mapbox developer blog that extends the rendering bounds of the map. Becomes necessary
    // once map is tilted, and/or expanded, otherwise, once the user pans the map, unrendered tiles will be visible..
    // It's essentially an animation loop, that continually resets the bounds to extend by 'val';
    var getPxBounds = this.map.getPixelBounds;

    this.map.getPixelBounds = function() {
      var bounds = getPxBounds.call(this);
      var val = 1000;
      bounds.min.x=bounds.min.x-val;
      bounds.min.y=bounds.min.y-val;
      bounds.max.x=bounds.max.x+val;
      bounds.max.y=bounds.max.y+val;
      return bounds;
    };

      // Convert map div (w/ map) to an object that Three.js can manipulate.
    var mapObj = new THREE.CSS3DObject(mapDiv);
        mapObj.name = map;

    // Adjust position, rotation etc. of map in 3D and 2D space.
    mapObj.translateX(-200);
    // mapObj.translateZ(600);
    mapObj.rotateX(-1.2104011104574814);
    mapObj.rotateZ(0.05036278922340379);
    mapObj.rotateY(0.009467108961573944);
    // add the map to the scene
    scene.add(mapObj);
  };


  var renderThreeDMoon = function() {
    var _container2 = document.getElementById('container2');

        webGLRenderer = new THREE.WebGLRenderer({alpha: true});
        webGLRenderer.setSize(450, 450);
        webGLRenderer.setClearColor(0xffffff, 0.0);

        _container2.appendChild(webGLRenderer.domElement);

    var texture = THREE.ImageUtils.loadTexture('../images/starrySky.jpg');
        texture.needsUpdate = true;

    var sphereMaterial = new THREE.MeshBasicMaterial({map: texture});
    var radius = 550,
        segments = 16,
        rings = 16;

      sphere = new THREE.Mesh(new THREE.SphereGeometry(radius, segments, rings),   sphereMaterial);

      sphereObj = new THREE.Object3D();
      sphereObj.add(sphere);

    // sphereObj.rotateY(-1.5)
    scene.add(sphereObj);


  };

  var renderThreeDMarkers = function() {
    var _containers = document.getElementsByClassName('marker'); log('tainers'); log(_containers); log(camera); log(scene);


        for (var i = 0; i < _containers.length; i++) {
          webGLRenderer = new THREE.WebGLRenderer({alpha: true});
          webGLRenderer.setSize(450, 450);

          _containers[i].appendChild(webGLRenderer.domElement);

          // var texture = THREE.ImageUtils.loadTexture('~/Documents/Web_Sites/GoOnTour/GoOnTourApp/static/build/images/starrySky.jpg');
          // texture.needsUpdate = true;

        var sphereMaterial = new THREE.MeshPhongMaterial( { color: 0x116cd6, specular: 0x009900} );
          var radius = 50,
              segments = 32,
              rings = 32;

              var sphere = new THREE.Mesh(new THREE.SphereGeometry(radius, segments, rings),   sphereMaterial);

              var sphereObj = new THREE.CSS3DObject(_containers[i]);
                  sphereObj.add(sphere);

              sphereObj.translateZ(250);
              sphereObj.rotateX(-1.2104011104574814);
              // scene.add(sphereObj);

              webGLRenderer.render(scene, camera);

              var light = new THREE.DirectionalLight( 0xffffff );
                  light.position.set( 1, 1, 1 ).normalize();
              scene.add(light);
              log('pos'); log(sphereObj.position);
        }

  };

  //Render
  var animate = function() {
    requestAnimationFrame(animate);

    sphereObj.rotation.y += 0.012;

    webGLRenderer.render(scene, camera);
    css3DRenderer.render(scene, camera);
  };

  var render = function() {
    css3DRenderer.render(scene, camera);
  };



  return {
    threeDMap: renderThreeDMap,
   threeDMoon: renderThreeDMoon,
threeDMarkers: renderThreeDMarkers,
      animate: animate,
       render: render
 };

}) ();
