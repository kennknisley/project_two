d3.csv("cleaned_restaurant_data.csv").then(function(csv) {
  data = csv;
  addRestaurantMarkers();
});


// define map variable
var map = L.map('map', {
  center: [37.96, -91.83],
  zoom: 7
});
// define map tile layer and add to the map
var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });
streetmap.addTo(map);

// create sidebar
var sidebar = L.control.sidebar({
  autopan: false,
  closeButton: true,
  container: 'sidebar',
  position: 'right'
}).addTo(map);

// add content to sidebar
var panelContent = {
  id: 'userinfo',
  tab: '<i class="fa-gear"></i>',
  title: 'Poverty Data',
  Position: 'bottom'
};
sidebar.addPanel(panelContent);

// add restaurant markers to map  
var data;
function addRestaurantMarkers() {
  data.forEach(function(d) {
    var restaurantMarker = L.marker([+d.latitude, +d.longitude]);
    restaurantMarker.bindPopup("<h3>" + d.name + "</h3><h4>" + d.loopcheck  + "</h4>");
    restaurantMarker.addTo(map);
    //updateSidebarData();
  })
}




