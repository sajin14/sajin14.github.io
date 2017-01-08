    // TODO: use a constructor to create a new map JS object. You can use the coordinates
    // we used, 40.7413549, -73.99802439999996 or your own!
var map;

var initMap = function(){
   map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 28.5272181,
            lng: 77.0688976
        },
        zoom:11,
        mapTypeControl: false

    });

};