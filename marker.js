function createMap(counties) {

    var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.dark",
      accessToken: API_KEY
    });
  
    var baseMaps = {
      "Dark Map": darkmap
    };
  
    var overlayMaps = {
      "Counties": counties
    };
  
    var map = L.map("map", {
      center: [38.577, -92.174],
      zoom: 7,
      layers: [darkmap, counties]
    });
  
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(map);
  }
  
  function createMarkers(response) {

    var stations = response.features
  
    var countyMarkers = [];
  
    for (var index = 0; index < stations.length; index++) {
      var station = stations[index];
  
      var countyMarker = L.geoJSON(station,{
          color:"orange",
          fillOpacity:0.1,
          weight:0.3,
          fillColor:"#00000000"
      }).bindPopup(`<h4>${station.properties.NAME} County</h4>`);
  
      countyMarkers.push(countyMarker);
    }
  
    createMap(L.layerGroup(countyMarkers));
  }

  d3.json('/Resources/countyLines.json').then(createMarkers);
  
  