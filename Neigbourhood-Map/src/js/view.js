var map;
var markers = [];
var address;
var view = {

};
var largeInfoWindow;
//Initialize Map
view.initMap = function() {
   map = new google.maps.Map(document.getElementById('map'), {
      center: {
         lat: 28.5272181,
         lng: 77.0688976
      },
      zoom: 8,
      mapTypeControl: false

   });
};

view.initialize = function(locations) {
   //Initialize infowindow       
   largeInfoWindow = new google.maps.InfoWindow({
      maxWidth: 250
   });
   var pinColor;
   var pinImage;
   for (var i = 0; i < locations.length; i++) {

      var position = locations[i].position;
      var title = locations[i].name;
      var id = locations[i].id;
      //Setting Marker color according to location type  
      switch (locations[i].type) {
         case 'school':
            pinColor = "59c605";
            break;
         case 'college':
            pinColor = "05c6bd";
            break;
         case 'hospital':
            pinColor = "c60505";
            break;
         case 'mall':
            pinColor = "0905c6";
            break;
         case 'multiplex':
            pinColor = "db36c2";
            break;
         case 'tourist':
            pinColor = "ead219";
            break;

      }
      //Setting Marker image
      pinImage = new google.maps.MarkerImage("https://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor);

      var marker = new google.maps.Marker({
         position: position,
         title: title,
         animation: google.maps.Animation.DROP,
         id: id,
         icon: pinImage
      });
      markers.push(marker);
      marker.addListener('click', (function(c) {
         return function() {
            view.populateInfoWindow(this, largeInfoWindow, locations[c]);
         };
      })(i));



   }

   view.showlistings();




};



//Show the markers in the map
view.showlistings = function() {
   var bounds = new google.maps.LatLngBounds();


   for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
      bounds.extend(markers[i].position);

   }
   map.fitBounds(bounds);

};
//Hide markers when filter applied
view.hidelistings = function() {
   for (var i = 0; i < markers.length; i++) {
      for (var k = 0; k < hideMarkers.length; k++) {
         if (i == hideMarkers[k])
            markers[i].setMap(null);
      }
   }
};

//Return current marker

view.getMarker = function(location) {
   for (i = 0; i < markers.length; i++) {
      if (markers[i].id == location.id)
         return markers[i];
   }
};

//Returns infowindow
view.getInfoWindow = function() {
   return largeInfoWindow;
};



//It sets contents in info window
view.populateInfoWindow = function(marker, infoWindow, location) {
   //Make Marker Bounce   
   //Make any bouncing markers stop
   markers.forEach(function(bouncemarker) {

      bouncemarker.setAnimation(null);
   });

   marker.setAnimation(google.maps.Animation.BOUNCE);
   if (infoWindow.marker != marker) {
      infoWindow.marker = marker;
      infoWindow.setContent('');
      view.wiki(location, infoWindow);

      infoWindow.setContent('<div><h1>' + marker.title + '</h1></div><hr>');
   }



   infoWindow.open(map, marker);

   //close marker and stop marker animation
   infoWindow.addListener('closeclick', function() {
      infoWindow.marker = null;
      marker.setAnimation(null);
   });

};


//Wikipedia Api to retrieve articles about Location
view.wiki = function(location, infoWindow) {
   var article;
   var city = 'New Delhi';
   var name = location.name;

   var wikiurl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + name + '&format=json&callback=wikiCallback';


   $.ajax({
      url: wikiurl,
      dataType: "jsonp"
   }).done(function(response) {
      article = response[2];
      if (article === '') {
         article = " No Data available";
      }
      infoWindow.setContent('<div><h1>' + location.name + '</h1></div><hr>' + '<div class= "description">' + article + '</div><hr><div>Source: Media Wiki API</div>');

   }).fail(function() {
      article = "Failed to Load wikipedia articles";
      infoWindow.setContent('<div><h1>' + location.name + '</h1></div><hr>' + '<div class= "description">' + article + '</div>');

   });

};