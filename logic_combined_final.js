// define variable
var sidebar;
var data;
var f;
var s;
var mo_data_csv;
// read from the data sources
d3.csv("cleaned_restaurant_data_2.csv").then(function(csv) {
  data = csv;
  return createFeatures();
  }).then(function(restaurantMarkers){
    d3.csv('mo_data.csv').then(function(data)
    {
      mo_data_csv = data;
      loadJSON(restaurantMarkers);
    });
  });
  function loadJSON(restaurantMarkers){
    d3.json('countyLines.json').then(function(data){
      var countyMarkers = createMarkers(data);
      createMap(restaurantMarkers, countyMarkers);
    });
  };
  // function to create county color based on unemployment rate
  function chooseColor(station){ 
    for (var data=0; data<mo_data_csv.length; data++){
        var record = mo_data_csv[data];
        f=record.County.substring(0, record.County.length-12);
        s=station;
        if (f===s){
          var unemp=+record.AllAgesinPovertyPercent;         
        if (unemp >22){
          return "#a50026"
        }
        else if (unemp>19){
          return "#d3322b"
        }
        else if (unemp>16){
          return "#f16d43"
        }
        else if (unemp>14){
          return "#fcab63"
        }
        else if (unemp>12){
          return "#fedc8c"
        }
        else if (unemp>10){
          return "#d7ee8e"
        }
        else if (unemp>8){
          return "#64bc61"
        }
        else if (unemp>1){
          return "#23964f"
        }
        else{
          return "#000000"
        }
      }
    }
  }
  // create the county lines
  function createMarkers(response) {
    var stations = response.features;
    stations = stations.filter(station=>station.properties.STATE==29);
    var countyMarkers = [];
    // for (var index = 0; index < stations.length; index++) {
    stations.forEach(function(station) {  
      //var station = stations[index];
      var countyMarker = L.geoJSON(station,{
          style:{color:"black",
          fillOpacity:0.6,
          weight:0.3,
          fillColor: chooseColor(station.properties.NAME)},
          onEachFeature: function(feature,layer){
            layer.on({
              mouseover:function(event){
                layer=event.target;
                layer.setStyle({
                  fillOpacity:0.9
                  });
                },
              mouseout: function(event){
                layer=event.target;
                layer.setStyle({
                  fillOpacity:0.6
                  });
                }
              });
            layer.bindPopup(`<h4>${station.properties.NAME} County</h4>`);
            layer.on({
              click: function(event) {
                var unemploymentInfo = document.getElementById('countyname');
                console.log(station);
                unemploymentInfo.innerHTML = station.properties.NAME;
                sidebar.open('county');
              }
            });
            }
          });
      countyMarkers.push(countyMarker);
      });
    return L.layerGroup(countyMarkers);
    }
function getMoDataByCountyName(countyName) {
  mo_data_csv.forEach(function(record){
    console.log(countyName);
    console.log(record);
  });
}

// function to add markers, popups, and sidebar info
function createFeatures() {
  var markers = L.layerGroup();
  data.forEach(function(d) {
    // create circlemarkers with a popup on click
    var restaurantMarker = L.circleMarker([+d.latitude, +d.longitude], {
      fillcolor: "blue",
      color: "blue",
      weight: 0.5,
      radius: 5
    }).bindPopup("<h3>" + d.name + "</h3>");
    // create info for the sidebar
    restaurantMarker.on({
      click: function(event) {
        var restaurantInfo = document.getElementById('restaurantinfo');
        restaurantInfo.innerHTML = d.address;
        var restaurantName = document.getElementById('restaurantname');
        restaurantName.innerHTML = d.name;
        sidebar.open('restaurant');
        }
      }).addTo(markers);
  });
  return markers;
}
// function to create map with layers
function createMap(restaurantMarkers, countyMarkers) {
  // define map tile layers
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
    Restaurants : restaurantMarkers,
    Counties : countyMarkers
    };
  // define map with center, zoom level and layers
  var map = L.map('map', {
    center: [37.96, -91.83],
    zoom: 7,
    layers: [streetmap, restaurantMarkers]
    });
  // add control to the layers
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
    }).addTo(map)
  // create sidebar
  sidebar = L.control.sidebar({
    autopan: false,
    closeButton: true,
    container: 'sidebar',
    position: 'left'
  }).addTo(map);
}




