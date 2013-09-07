var map;
var markers = {};
var notSet = true;

$(document).ready(function()
{
    makeMap();
});

var setupMotionHandlers = function(callback) {
    var dir = 0;
    var loc = null;


    if (navigator.geolocation) {
         navigator.geolocation.watchPosition(function(position) {
             loc = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
             if (notSet) {
                   map.setCenter(loc);
                   notSet = false;
               }
               callback(loc, dir);
        }, function() {
             //not going to give it to us
         });
    };

    function deviceOrientationHandler(tiltLR, tiltFB, heading, motUD) {
        if (Math.abs(tiltLR)>5 || Math.abs(tiltFB)>5) {
            dir = Math.round((Math.atan(tiltFB/tiltLR) * 180/Math.PI +90) /22.5);
            if (tiltLR < 0){
                dir += 8;
            }
        } else if (tiltLR == 0 && tiltFB ==0 && heading) {
            dir = Math.round(heading/22.5)
        } else {
            dir = 0;
        }
    }
    setInterval(function() {
        callback(loc, dir);
    },1000);

    if (window.DeviceOrientationEvent) {
        console.log("Listen on DeviceOrientationEvent");
      // Listen for the deviceorientation event and handle the raw data
      window.addEventListener('deviceorientation', function(eventData) {
        // gamma is the left-to-right tilt in degrees, where right is positive
        var tiltLR = eventData.gamma;

        // beta is the front-to-back tilt in degrees, where front is positive
        var tiltFB = eventData.beta;

        // alpha is the compass direction the device is facing in degrees
        var dir = eventData.alpha;
        // handle ios on 3gs
        if (eventData.webkitCompassHeading) {
            dir = eventData.webkitCompassHeading;
        }

        // deviceorientation does not provide this data
        var motUD = null;

        // call our orientation event handler
        deviceOrientationHandler(tiltLR, tiltFB, dir, motUD);
      }, false);
    } else if (window.OrientationEvent) {
        console.log("Listen on OrientationEvent");
      window.addEventListener('MozOrientation', function(eventData) {
        // x is the left-to-right tilt from -1 to +1, so we need to convert to degrees
        var tiltLR = eventData.x * 90;

        // y is the front-to-back tilt from -1 to +1, so we need to convert to degrees
        // We also need to invert the value so tilting the device towards us (forward)
        // results in a positive value.
        var tiltFB = eventData.y * -90;

        // MozOrientation does not provide this data
        var dir = null;

        // z is the vertical acceleration of the device
        var motUD = eventData.z;

        // call our orientation event handler
        deviceOrientationHandler(tiltLR, tiltFB, dir, motUD);
      }, false);
    } else    if (window.DeviceMotionEvent) {
        console.log("Listen on DeviceMotionEvent");

            window.ondevicemotion = function(event) {

                var tiltLR = event.rotationRate.gamma;

                // beta is the front-to-back tilt in degrees, where front is positive
                var tiltFB = event.rotationRate.beta;

                // alpha is the compass direction the device is facing in degrees
                var dir = event.rotationRate.alpha;

                // deviceorientation does not provide this data
                var motUD = null;
                deviceOrientationHandler(tiltLR, tiltFB, 0, 0);
            }
    }  else {
        // don't care
    }
}


function makeMap() {
    var myOptions =
    {
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: false,
        panControl: false,
        scrollwheel: false,
        streetViewControl: true
    };

    map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
    marker = makeMarker(-42.902896, 147.337293, null, 1, "Node Schmode");
    //var image = new google.maps.MarkerImage('http://biblprog.org.ua/programsimages/python/Python_icon.jpg');
    var image = new google.maps.MarkerImage("http://www.dubailynx.com/images/mapIcons2/Map_Icon_5.png");
    image.anchor = new google.maps.Point(0,32);
    marker.setIcon(image);
    var infowindow = new google.maps.InfoWindow({
        content: "Find out how to build this app<br/> @'<a href='http://2012.pycon-au.org/schedule/63/view_talk?day=sunday'>Node Schmode!</a>'<br/>14:30 19 Aug, Derwent 1, Pycon-Au"
    });
    infowindow.open(map,marker);
    google.maps.event.addListener(marker, 'click', function() {
      infowindow.open(map,marker);
    });
    google.maps.event.addListener(marker, 'doubleclick', function() {
        map.setCenter(event.latLng);
        map.setZoom(map.getZoom()+1);
    });
    google.maps.event.addListener(map, 'doubleclick', function(event) {
        map.setCenter(event.latLng);
        map.setZoom(map.getZoom()+1);
    });
    marker.setMap(map);
}

var small = 'http://maps.google.com/mapfiles/ms/micons/red-dot.png'
var large = 'http://maps.google.com/mapfiles/ms/micons/yellow-dot.png'

function removeMarker(marker) {
    marker.setMap(null);
}

function makeMarker(lat, lon, me, count, uid) {
    var marker = new google.maps.Marker({
    });
    //marker.setAnimation(google.maps.Animation.DROP);
    var image = new google.maps.MarkerImage(small);
//    image.anchor = new google.maps.Point(100,100);
    marker.setIcon(image);
    marker.setPosition(new google.maps.LatLng(lat,lon));
    marker.setTitle(uid);
    return marker;

}

function moveMarker(marker, lat, lon) {
    marker.setPosition(new google.maps.LatLng(lat,lon));
}

function animateMarker(marker, dlat, dlon, step) {
    if (step == 0) {
        return;
    }
    var cur = marker.getPosition();
    moveMarker(marker,
            cur.lat() + (dlat - cur.lat())/step,
            cur.lng() + (dlon - cur.lng())/step
    );
    window.setTimeout(function() {animateMarker(marker, dlat, dlon, step-1)},100);
}

function showPin(results, purge, meuid)
{
    for (var i = 0; i < results.length; i++) {
    	var lat = results[i][0];
    	var lon = results[i][1];
        var uid = results[i][2];
        var dir = results[i][3];
        var marker = markers[uid]
        if (lat == null || lon == null) {
        	if (marker != null) {
                removeMarker(marker);
                delete markers[uid];
        	}
        } else {
        	if (marker == null) {
                marker = makeMarker(lat, lon, meuid == uid, 1, uid);
                marker.setMap(map);
            } else {
                marker.setMap(map);
                marker.isAdded = false; //should be in markerclusterer
                animateMarker(marker, lat, lon, 5);
                //moveMarker(marker, lat, lon);
                // if (meuid != uid) {
                //    clusterer.addMarker(marker);
                //    clusterer.redraw();
                // }
                delete markers[uid];
            }
            marker.setIcon(makeDirImage(dir));
            markers[uid] = marker;
        }
    }
    if (purge) {
        for (key in markers) {
            marker = markers[key];
            removeMarker(marker);
            delete markers[uid];
        }
    }
    setCount();
}

function clearPins() {
	// Deletes all markers in the array by removing references to them
    // remove all outside these bounds
	for(var key in markers) {
        var marker = markers[key];
        removeMarker(marker);
        delete markers[key];
	}
    setCount();
}

function setCount() {
    //var cnt = Object.keys(markers).length+1
    var cnt = 1;
    for( var i in markers ) {
        cnt++;
    }
    $('#count').html(cnt);
}

var sprite_pos =
    [ [49,711],[0,34], [98,711],[98,365],[0,365],[98,417],[98,313],[98,797],[98,150],[0,711],
            [0,417],[98,0],[49,365],[49,417],[49,849],[0,849]]

var sprite = 'https://maps.gstatic.com/intl/en_ALL/mapfiles/cb/mod_cb_scout/cb_scout_sprite_004.png';

function makeDirImage(dir) {
    var pos = sprite_pos[dir];
    return new google.maps.MarkerImage(
        sprite, 
        new google.maps.Size(49, 52),
        new google.maps.Point(pos[0], pos[1]),
        new google.maps.Point(Math.floor(49/2), Math.floor(52/2))
       )
}