var data;
d3.csv("cleaned_restaurant_data_2.csv").then(function(csv) {
  data = csv;
  createFeatures();
});

// create sidebar
var sidebar = L.control.sidebar({
  autopan: false,
  closeButton: true,
  container: 'sidebar',
  position: 'left'
}).addTo(map);

// function to add markers, popups, and sidebar
function createFeatures() {
  var markers = L.layerGroup();
  data.forEach(function(d) {
    var restaurantMarker = L.circleMarker([+d.latitude, +d.longitude], {
      fillcolor: "blue",
      color: "blue",
      weight: 0.5,
      //radius: 500
    }).bindPopup("<h3>" + d.name + "</h3>");
    restaurantMarker.on({
      click: function(event) {
        var restaurantInfo = document.getElementById('restaurantinfo');
        restaurantInfo.innerHTML = d.address;
        var restaurantName = document.getElementById('restaurantname');
        restaurantName.innerHTML = d.name;
        sidebar.open('home');
        }
      }).addTo(markers);
  });
  createMap(markers);
}

function createMap(markers) {
  // define map tile layer and add to the map
var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
  });
var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.dark",
  accessToken: API_KEY
  });
var baseMaps = {
  "Street Map": streetmap,
  "Dark Map" : darkmap
  };
var overlayMaps = {
  Restaurants : markers
  };
// define map variable
var map = L.map('map', {
  center: [37.96, -91.83],
  zoom: 7,
  layers: [streetmap, markers]
  });
L.control.layers(baseMaps, overlayMaps, {
  collapsed: false
}).addTo(map)
}




