
var flag = ko.observable(0);
var k=ko.observable(0);
var hideMarkers = [];

var viewModel = {
	selectedOption : ko.observable(),
	results: ko.observableArray([])

};
 
viewModel.initialize = function(){
	 view.initMap();
	 view.initialize(locations);
	 this.showPanel();
}     


viewModel.show = function()
{

   flag(1);
   this.filter();
   view.showlistings();
   view.hidelistings();
   this.showPanel();
}


viewModel.filter = function(){
	hideMarkers.length = 0;
       for(i=0;i<locations.length;i++)	
       {
       	if(this.selectedOption()!=locations[i].id)
        {
        	
         	hideMarkers.push(i);
         }

    }

}

viewModel.reset = function(){
	flag(0);
	view.showlistings();
	this.showPanel();
}

viewModel.showPanel =function(){
	 this.results().length=0;
     if(flag()==0)
     {
     		for(var i=0;i<locations.length;i++)
{
     	this.results.push(locations[i]);
     }}
     else
     {


	for(var i=0;i<locations.length;i++)
{

   if(this.selectedOption() == locations[i].id)
   	{
   		this.results.push(locations[i]);
    }
 }
}
}

ko.applyBindings(viewModel);
