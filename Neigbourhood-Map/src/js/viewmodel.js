var flag = ko.observable(0);
var hideMarkers = [];


var viewModel = {
   selectedOption: ko.observable(),
   results: ko.observableArray([]),
   currentmarker: ko.observable(markers[0]),
   infoWindow: ko.observable()

};

//Ititialize function 
viewModel.initialize = function() {
   view.initMap();
   view.initialize(locations);
   this.showPanel();
};

//Function to show markers after filter is applied
viewModel.show = function() {

   flag(1);
   this.filter();
   view.showlistings();
   view.hidelistings();
   this.showPanel();
};

//Filter out locations according to type
viewModel.filter = function() {
   hideMarkers.length = 0;
   for (i = 0; i < locations.length; i++) {
      if (this.selectedOption() != locations[i].type) {

         hideMarkers.push(i);
      }

   }

};

//Function to reset the map to initial stage
viewModel.reset = function() {
   flag(0);
   view.showlistings();
   this.showPanel();
};

//Function to pop marker infowindow when corresponding list entry cliecked
viewModel.info = function(e) {
   viewModel.currentmarker(view.getMarker(e));
   viewModel.infoWindow(view.getInfoWindow());
   view.populateInfoWindow(viewModel.currentmarker(), viewModel.infoWindow(), e);


};

//Function to display entry on side panel
viewModel.showPanel = function() {
   this.results().length = 0;
   var i;
   if (flag() === 0) {
      for (i = 0; i < locations.length; i++) {
         this.results.push(locations[i]);
      }
   } else {


      for (i = 0; i < locations.length; i++) {

         if (this.selectedOption() == locations[i].type) {
            this.results.push(locations[i]);
         }
      }
   }
};

error = function() {
   alert("Error loading Google Maps");
};

//applying bindingss

ko.applyBindings(viewModel);