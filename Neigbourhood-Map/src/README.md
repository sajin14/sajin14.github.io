#Neighbourhood Map
This website gives location details about important places in NewDelhi. This app is built under **MVVM** architecture.

Check the Site [Neighbourhood Map](https://sajin14.github.io/Neigbourhood-Map/)

##How to open
Click on index.html file inside local directory to open this website

##Features
* Locations can be filtered out according to type given in the dropdown menu.
* List view of locations are given in the side panel
* Users can click on the list entries or markers, On click an infowindow is opened showing details about location.
* **MVVM** Architecture is used.
* knockout.js is used.


##API's Used
###Google Map's API
*Google maps API is used and loaded asynchronously to load the map and locate markers for each location.
*Different color for markers are used for different types of locations such as hospitals,schools,colleges etc.
*Info window is provided when we click locations list or markers.

###Wikipedi API
*This is used to fetch articles about locations.
*Articles are appended to info window of marker

##MVVVM Architecture
The java script files are seperated into three- view.js,viewModel.js and model.js
###viewModel.js
* It is the engine of the app.
* It stand as middleman between view and model.
* No direct contact between  view and model. 

###view.js
* It helps to load maps and markers

###model.js
* It stores all the data required for this app.

###knockout.js
* It is used to avoid DOM manipulation with javaquery.
*Data binding is used for DOM manipulation

##Error Handling
* Time out functions are used in Wikipedia API's function inorder to handle error