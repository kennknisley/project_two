// define map variable
var map = L.map('map');
// define map tile layer and add to the map
var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });
streetmap.addTo(map);
// set centerpoint and zoom of map
map.setView([37.96, -91.83], 7);

// add restaurant markers to map  
var data;
function addRestaurantMarkers() {
  data.forEach(function(d) {
    var restaurantMarker = L.marker([+d.latitude, +d.longitude]);
    restaurantMarker.bindPopup("<h3>" + d.name + "</h3><h4>" + d.loopcheck  + "</h4>");
    restaurantMarker.addTo(map);
  })
}
d3.csv("cleaned_restaurant_data.csv").then(function(csv) {
  data = csv;
  addRestaurantMarkers();
});
