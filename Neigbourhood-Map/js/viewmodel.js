
var flag = ko.observable();
var viewModel = {
	selectedOption : ko.observable()

};
 
viewModel.initialize = function(){
	view.initMap();
}     


viewModel.show = function()
{
 //   view.hidelistings();
    view.show();
}


ko.applyBindings(viewModel);
