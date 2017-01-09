    // TODO: use a constructor to create a new map JS object. You can use the coordinates
    // we used, 40.7413549, -73.99802439999996 or your own!
    var map;
    var markers = [];
    var view = {};
    var filterMarker = ko.observable;
    view.initMap = function() {
        map = new google.maps.Map(document.getElementById('map'), {
            center: {
                lat: 28.5272181,
                lng: 77.0688976
            },
            zoom: 8,
            mapTypeControl: false

        });
    }

    view.initialize = function(locations) {
        var largeInfoWindow = new google.maps.InfoWindow();
        var pinColor;
        var pinImage;
        console.log("Entered");
        for (var i = 0; i < locations.length; i++) {

            var position = ko.observable(locations[i].position);
            var title = ko.observable(locations[i].name);
            //Setting Marker color according to location type  
            switch (locations[i].id) {
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
                case 'pub':
                    pinColor = "db36c2";
                    break;
                case 'tourist':
                    pinColor = "ead219";
                    break;

            }

            pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor);

            var marker = new google.maps.Marker({
                position: position(),
                title: title(),
                animation: google.maps.Animation.DROP,
                id: i,
                icon: pinImage
            });
            markers.push(marker);
            marker.addListener('click', function() {
                populateInfoWindow(this, largeInfoWindow);
            });



        };
        //Initialize drawer
        var drawingManager = new google.maps.drawing.DrawingManager({
            drawingMode: google.maps.drawing.OverlayType.POLYGON,
            drawingControl: true,
            drawingControlOptions: {
                position: google.maps.ControlPosition.TOP_LEFT,
                drawingModes: [google.maps.drawing.OverlayType.POLYGON]
            }
        });


        searchgeo = function() {
            var geocoder = new google.maps.Geocoder();
            var address = document.getElementById('place').value;
            if (address == '') {
                alert('You must enter a city');
            } else {
                geocoder.geocode({
                    address: address,
                    componentRestrictions: {
                        locality: 'Thiruvananthapuram'
                    }
                }, function(results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        map.setCenter(results[0].geometry.location);
                        map.setZoom(15);
                        var address = "",
                            city = "",
                            town = "",
                            state = "",
                            country = "",
                            location = "",
                            format = "";
                        for (var i = 0; i < results[0].address_components.length; i++) {
                            var addr = results[0].address_components[i];
                            if (addr.types[0] == 'country') country = addr.short_name;
                            else if (addr.types[0] == 'street_address')
                                address = address + addr.long_name;
                            else if (addr.types[0] == 'route')
                                address = address + addr.long_name;
                            else if (addr.types[0] == ['administrative_area_level_1'])
                                state = addr.long_name;
                            else if (addr.types[0] == ['administrative_area_level_2'])
                                town = addr.long_name;
                            else if (addr.types[0] == ['locality'])
                                city = addr.long_name;
                            else if (addr.types[0] == ['location'])
                                location = addr.location;
                        }
                        largeInfoWindow.setContent('<div>Formated Address: ' + format + '\n' + 'City: ' + city + '\n' + 'Town: ' + town + '\n' + 'State: ' + state + '\n' + 'Country: ' + country + '\n' + 'Coordinates: ' + location + '</div>');
                        largeInfoWindow.open(map, null);
                    } else
                        alert("No results");
                });
            }

        };

        view.showlistings();
        //     document.getElementById('search').addEventListener('click', view.showlistings);
        //         document.getElementById('hide').addEventListener('click', hidelistings);
        //        document.getElementById('search').addEventListener('click', searchgeo);
        //       document.getElementById('toggle-drawing').addEventListener('click', function() {
        //          toggleDrawing(drawingManager);
        //      });
        drawingManager.addListener('overlaycomplete', function(event) {
            if (polygon) {
                polygon.setMap(null);
                hidelistings();
            }

            drawingManager.setDrawingMode(null);
            polygon = event.overlay;
            polygon.setEditable(true);
            searchWithinPolygon();
            polygon.getPath().addListener('set_at', searchWithinPolygon);
            polygon.getPath().addListener('insert_at', searchWithinPolygon);
            var a = google.maps.geometry.spherical.computeArea(polygon.getPath());
            alert('Area : ' + a);

        });




    };

    function populateInfoWindow(marker, infoWindow) {
        if (infoWindow.marker != marker) {
            infoWindow.marker = marker;
            //infoWindow.setContent('<div class=info>' + marker.title + '<br>' + marker.position + '</div>');
            infoWindow.setContent('');

            var streetViewService = new google.maps.StreetViewService();
            var radius = 50;

            getStreetView = function(data, status) {

                if (status == google.maps.StreetViewStatus.OK) {
                    var nearStreetViewLocation = data.location.latLng;
                    var heading = google.maps.geometry.spherical.computeHeading(
                        nearStreetViewLocation, marker.position);
                    infoWindow.setContent('<div>' + marker.title + '</div><div id = "pano"></div> ');
                    console.log(heading);

                    var panoramaOptions = {
                        position: nearStreetViewLocation,
                        pov: {
                            heading: heading,
                            pitch: 30
                        }
                    };
                    var panorama = new google.maps.StreetViewPanorama(
                        document.getElementById('pano'), panoramaOptions);
                    console.log(panorama);

                } else {
                    infoWindow.setContent('<div>' + marker.title + '</div>' + '<div>No Street view Found</div>');
                }
                //StreetView service to get nearest location.

            }
            streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
            infoWindow.open(map, marker);

            //close marker
            infoWindow.addListener('closeclick', function() {
                infoWindow.marker = null;
            });
        }


    }


    view.showlistings = function() {
        var bounds = new google.maps.LatLngBounds();


        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(map);
            bounds.extend(markers[i].position);

        }
        map.fitBounds(bounds);

    };

  view.hidelistings = function() {
       for (var i = 0; i < markers.length; i++) {
            for(var k=0;k<hideMarkers.length;k++)
            {
                if(i==hideMarkers[k])
                  markers[i].setMap(null);
        }
    }
  //      map.setZoom(8);
    };

    toggleDrawing = function(drawingManager) {
        if (drawingManager.map)
            drawingManager.setMap(null);
        else
            drawingManager.setMap(map);
    }

    searchWithinPolygon = function() {
        for (var i = 0; i < markers.length; i++) {
            if (google.maps.geometry.poly.containsLocation(markers[i].position, polygon)) {
                markers[i].setMap(map);

            } else {
                markers[i].setMap(null);
            }
        }
    }

  
